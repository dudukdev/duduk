import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {JSDOM} from 'jsdom';
import {setupJSDOMWindow} from "./jsdomWindow";

export async function ssr(html: string, js: string, globals: Record<string, any>, languages: string[], url: string): Promise<string> {
  const customElementsTagNames: string[] = [];
  moduleCache.clear();

  const jsdom = new JSDOM(html, {
    url,
    beforeParse(window) {
      window.__duduk = globals;
      // @ts-ignore
      window.fetch = () => ({then: () => {}, catch: () => {}});
      Object.defineProperty(window.navigator, 'languages', {value: languages});
      window.customElements.define = new Proxy(window.customElements.define, {
        apply(target, thisArg, argArray) {
          customElementsTagNames.push(argArray[0].toUpperCase());
          Reflect.apply(target, thisArg, argArray);
        }
      });
    }
  });
  setupJSDOMWindow(jsdom);

  const context = vm.createContext(jsdom.window);

  const sourceTextModule = new vm.SourceTextModule(js, {context});
  await sourceTextModule.link(getLinker(import.meta.dirname));
  await sourceTextModule.evaluate();

  createDeclarativeShadowDom(jsdom, jsdom.window.document, customElementsTagNames);

  return jsdom.window.document.body.innerHTML;
}

const moduleCache = new Map<string, vm.SourceTextModule>();

function getLinker(basePath: string): vm.ModuleLinker {
  return async (specifier, referencingModule, extra) => {
    if (specifier[0] === '/') {
      specifier = specifier.substring(1);
    }
    specifier = path.normalize(`${basePath}/${specifier}`);

    if (moduleCache.has(specifier)) {
      return moduleCache.get(specifier)!;
    }

    const fileContent = fs.readFileSync(specifier, {encoding: 'utf-8'});
    const sourceTextModule = new vm.SourceTextModule(fileContent, {
      context: referencingModule.context,
      identifier: specifier
    });

    // Do no async operations before setting the moduleCache
    moduleCache.set(specifier, sourceTextModule);

    await sourceTextModule.link(getLinker(path.dirname(specifier)));
    return sourceTextModule;
  };
}

function createDeclarativeShadowDom(jsdom: JSDOM, domPart: Document | ShadowRoot | Element, customElementsTagNames: string[]) {
  for (const child of domPart.children) {
    createDeclarativeShadowDom(jsdom, child, customElementsTagNames);
    if (customElementsTagNames.includes(child.tagName.toUpperCase())) {
      if (
        child.shadowRoot !== null &&
        ![...child.children]
          .some(
            (child: Element) =>
              child.tagName === 'TEMPLATE' &&
              child.hasAttribute('shadowrootmode'))
      ) {
        createDeclarativeShadowDom(jsdom, child.shadowRoot, customElementsTagNames);

        const template = jsdom.window.document.createElement('template');
        template.setAttribute('shadowrootmode', 'open');
        template.innerHTML = child.shadowRoot.innerHTML;

        child.prepend(template);
      }
    }
  }
}
