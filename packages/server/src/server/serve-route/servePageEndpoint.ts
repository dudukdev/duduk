import type {LocaleStrings} from "@duduk/localization";
import type {RoutePart} from "./models";
import type {IncomingMessage, RequestListener} from "node:http";
import {parseHeader} from "@duduk/content-negotiation";
import {appCss, getLocaleStrings, rootCss, setupClient} from "./rootFiles";
import {ssr} from "@duduk/ssr";

interface Globals {
  pageData: object;
  pageParams: Record<string, string>;
  prependStyles: string | undefined;
  locales?: LocaleStrings;
}

export async function printPage(req: IncomingMessage, res: Parameters<RequestListener>[1], stack: RoutePart[], params: Record<string, string>, locals: App.Locals): Promise<void> {
  const layouts: { path: string; id: string }[] = [];
  let cumulatedData = {};
  for (const routePart of stack) {
    if (routePart.layoutServer?.data !== undefined) {
      cumulatedData = {...cumulatedData, ...await routePart.layoutServer.data({request: req, data: cumulatedData, locals})}
    }
    if (routePart.layout !== undefined) {
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
  cumulatedData = {...cumulatedData, ...lastPart.pageServer?.data !== undefined ? await lastPart.pageServer.data({request: req, data: cumulatedData, locals}) : {}}
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
  if (setupClient !== undefined) {
    imports.push(`import "${setupClient}";`);
  }
  imports.reverse();
  customElementsDefines.reverse();

  const globals: Globals = {
    pageData: data,
    pageParams: params,
    prependStyles: appCss !== undefined ? `@import url("${appCss}");` : undefined
  };
  const locales = getLocaleStrings?.(req.headers['accept-language'] ?? []);
  if (locales !== undefined && Object.entries(locales).length > 0) {
    globals.locales = locales;
  }
  const languages = parseHeader(req.headers['accept-language'] ?? '').map(v => v.value);
  const url = req.headers.referer ?? `https://${(req.headers.origin ?? req.headers.host ?? 'localhost')}${req.url}`;
  const serverSideRenderedHtml = await ssr(html, `${imports.join('')} ${customElementsDefines.join('')}`, globals, languages, url);

  const additionalHeadEntries: string[] = [];
  if (rootCss !== undefined) {
    additionalHeadEntries.push(`<style>${rootCss}</style>`);
  }
  if (appCss !== undefined) {
    additionalHeadEntries.push(`<link rel="stylesheet" href="${appCss}">`);
  }

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />${additionalHeadEntries.length > 0 ? `\n${additionalHeadEntries.join('\n')}` : ''}
</head>
<body>
    ${serverSideRenderedHtml}
    <script type="module">
        window.__duduk = ${JSON.stringify(globals)};
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
    import: `import Page${page.id} from "${page.path}";`,
    define: `customElements.define("fw-page-${page.id}", Page${page.id});`
  };
}

async function renderLayout(layout: { path: string; id: string }, slot: string): Promise<{ html: string, import: string, define: string }> {
  return {
    html: `<fw-layout-${layout.id}>${slot}</fw-layout-${layout.id}>`,
    import: `import Layout${layout.id} from "${layout.path}";`,
    define: `customElements.define("fw-layout-${layout.id}", Layout${layout.id});`
  }
}
