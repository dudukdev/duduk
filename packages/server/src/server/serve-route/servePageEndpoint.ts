import type {RoutePart} from "./models";
import type {IncomingMessage, RequestListener} from "node:http";
import mime from "mime";
import {ssr} from "./ssr";
import fsPromise from "node:fs/promises";
import {parseHeader} from "@framework/content-negotiation";

const rootCss: string | undefined = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('root-') && itemName.endsWith('.css')) {
      return await fsPromise.readFile(`${folder}/${itemName}`, {encoding: 'utf8'});
    }
  }
  return undefined;
})();

const appCss: string | undefined = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('app-') && itemName.endsWith('.css')) {
      return `/__app/${itemName}`;
    }
  }
  return undefined;
})();

const setupClient: string | undefined = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('setupClient-') && itemName.endsWith('.js')) {
      return `/__app/${itemName}`;
    }
  }
  return undefined;
})();

const getLocaleStrings = await (async function () {
  const folder = `${import.meta.dirname}/__app/_.._/inject`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('locales-') && itemName.endsWith('.js')) {
      const localesFiles: typeof import('../../inject/locales') = await import(`${folder}/${itemName}`);
      return localesFiles.getLocaleStrings;
    }
  }
  return undefined;
})();

export async function printPage(req: IncomingMessage, res: Parameters<RequestListener>[1], stack: RoutePart[], params: Record<string, string>): Promise<void> {
  const layouts: { path: string; id: string }[] = [];
  let cumulatedData = {};
  for (const routePart of stack) {
    if (routePart.layout !== undefined) {
      cumulatedData = {...cumulatedData, ...routePart.layoutServer?.data !== undefined ? await routePart.layoutServer.data({request: req}) : {}}
      layouts.push({
        path: routePart.layout.path,
        id: routePart.layout.id
      });
    }
  }
  const lastPart = stack[stack.length - 1];
  if (lastPart.page === undefined) {
    res.writeHead(500);
    res.end('500 Internal Server Error');
    return;
  }
  cumulatedData = {...cumulatedData, ...lastPart.pageServer?.data !== undefined ? await lastPart.pageServer.data({request: req}) : {}}
  const page = {
    path: lastPart.page.path,
    id: lastPart.page.id
  }

  await render(req, res, cumulatedData, layouts, page, params);
}

async function render(req: IncomingMessage, res: Parameters<RequestListener>[1], data: object, layouts: { path: string; id: string }[], page: { path: string; id: string }, params: Record<string, string>): Promise<void> {
  const renderedPage = await renderPage(page);

  const imports: string[] = [renderedPage.import];
  const customElementsDefines: string[] = [renderedPage.define];
  let html = renderedPage.html;

  for (const layout of layouts.toReversed()) {
    const renderedLayout = await renderLayout(layout, html);
    imports.push(renderedLayout.import);
    customElementsDefines.push(renderedLayout.define);
    html = renderedLayout.html;
  }
  imports.push(`import '${setupClient}';`);
  imports.reverse();
  customElementsDefines.reverse();

  const prependStyles = `@import url("${appCss}");`;

  const globals = {pageData: data, pageParams: params, prependStyles};
  const locales = getLocaleStrings?.(req.headers['accept-language'] ?? []);
  if (locales !== undefined && Object.entries(locales).length > 0) {
    globals['locales'] = locales;
  }
  const languages = parseHeader(req.headers['accept-language'] ?? '').map(v => v.value);
  const url = req.headers.referer ?? `https://${(req.headers.origin ?? req.headers.host ?? 'localhost')}${req.url}`;
  const serverSideRenderedHtml = await ssr(html, `${imports.join('')} ${customElementsDefines.join('')}`, globals, languages, url);

  res.writeHead(200, {'Content-Type': mime.getType('html')});
  res.end(`
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    ${rootCss !== undefined ? `<style>${rootCss}</style>` : ''}
    ${appCss !== undefined ? `<link rel="stylesheet" href="${appCss}">` : ''}
</head>
<body>
    ${serverSideRenderedHtml}
    <script type="module">
        window.__app = ${JSON.stringify(globals)};
    </script>
    <script type="module">
        ${imports.join('')}
        ${customElementsDefines.join('')}
    </script>
</body>
</html>`);
}

async function renderPage(page: { path: string; id: string }): Promise<{ html: string, import: string, define: string }> {
  return {
    html: `<fw-page-${page.id}></fw-page-${page.id}>`,
    import: `import Page${page.id} from '${page.path}';`,
    define: `customElements.define('fw-page-${page.id}', Page${page.id});`
  };
}

async function renderLayout(layout: { path: string; id: string }, slot: string): Promise<{ html: string, import: string, define: string }> {
  return {
    html: `<fw-layout-${layout.id}>${slot}</fw-layout-${layout.id}>`,
    import: `import Layout${layout.id} from '${layout.path}';`,
    define: `customElements.define('fw-layout-${layout.id}', Layout${layout.id});`
  }
}
