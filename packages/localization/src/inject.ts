import {translate} from "./translate";
import {defaultLanguages} from "./defaultLanguage";

export function injectI18n(parent: HTMLElement): void {
  if (!parent.shadowRoot) {
    return;
  }
  const i18nElements: {
    element: Element;
    content: string | undefined;
    attributes: Record<string, string>
  }[] = [];

  const walker = (elements: NodeListOf<Element>) => {

    for (const element of elements) {
      let content: string | undefined = undefined;
      let attributes: Record<string, string> = {};

      for (const attribute of element.attributes) {
        if (attribute.name === 'data-i18n') {
          content = element.textContent!;
        } else if (attribute.name.startsWith('data-i18n-')) {
          const attributeName = attribute.name.substring(10);
          if (element.hasAttribute(attributeName)) {
            attributes[attributeName] = element.getAttribute(attributeName)!;
          }
        }
      }

      if (content !== undefined || Object.keys(attributes).length > 0) {
        i18nElements.push({element, content, attributes});
      }

      if (element instanceof HTMLTemplateElement) {
        walker(element.content.querySelectorAll('*'));
      }
    }

  };

  walker(parent.shadowRoot.querySelectorAll('*'));

  for (const i18nElement of i18nElements) {
    if (i18nElement.content !== undefined) {
      const translation = translate(i18nElement.content, {locale: defaultLanguages()});
      if (translation !== undefined) {
        i18nElement.element.textContent = translation;
        i18nElement.element.removeAttribute('data-i18n');
      }
    }
    for (const [name, id] of Object.entries(i18nElement.attributes)) {
      const translation = translate(id, {locale: defaultLanguages()});
      if (translation !== undefined) {
        i18nElement.element.setAttribute(name, translation);
        i18nElement.element.removeAttribute(`data-i18n-${name}`);
      }
    }
  }
}
