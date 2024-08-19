import {css} from "./css";

export type ApplyTemplateResult = {
  childNodes: ChildNode[];
  getElement: <T extends HTMLElement = HTMLElement>(refName: string) => (T | undefined);
  applyTemplate: (refName: string, count: number) => ApplyTemplateResult;
}[];
export type Property = { type: String | Boolean | Number | Object };
export type Properties = Record<string, Property>;

export class WebComponent extends HTMLElement {

  static template?: DocumentFragment;
  static styles?: HTMLStyleElement;
  static properties?: Properties;

  private propertyState: Record<string, unknown> = {};

  // noinspection JSUnusedGlobalSymbols
  static get observedAttributes(): string[] {
    return Object.keys(this.properties ?? {}).map(k => k.toLowerCase());
  }

  readonly #properties: Properties;

  constructor() {
    super();
    if (new.target === WebComponent) {
      throw new Error('Class WebComponent is an abstract class and cannot be used directly as component');
    }
    this.#properties = new.target.properties ?? {};

    for (const [name, options] of Object.entries<Property>(this.#properties)) {
      Object.defineProperty(this, name, {
        get: () => this.propertyState[name] ?? this.#parseStringToPropertyValue(this.getAttribute(name.toLowerCase()), options),
        set: (value) => {
          if (options.type === String || options.type === Number || options.type === Boolean) {
            this.setAttribute(name, value);
          } else {
            // @ts-ignore
            this[`_${name}`] = value;
            this.propertyState[name] = value;
          }
        },
        enumerable: true
      });
    }

    if (!this.shadowRoot) {
      const template = new.target.template;
      const styles = new.target.styles ?? css``;

      this.attachShadow({mode: 'open'});
      if (styles !== undefined) {
        this.shadowRoot!.appendChild(styles.cloneNode(true));
      }
      if (template !== undefined) {
        this.shadowRoot!.appendChild(template.cloneNode(true));
      }
    }
  }

  // noinspection JSUnusedGlobalSymbols
  attributeChangedCallback(name: string, _: string, newValue: string | null): void {
    const foundProperty = Object.entries(this.#properties).find(([propName]) => name.toLowerCase() === propName.toLowerCase());
    if (foundProperty !== undefined) {
      const propertyName = foundProperty[0];
      const propertyDefinition = foundProperty[1];

      const parsedValue = this.#parseStringToPropertyValue(newValue, propertyDefinition);

      this.propertyState[propertyName] = parsedValue;
      if (`_${propertyName}` in this) {
        // @ts-ignore
        this[`_${propertyName}`] = parsedValue;
      }
    }
  }

  getElement<T extends HTMLElement = HTMLElement>(refName: string): T | undefined {
    return this.#getElementOfCollection(refName, this.shadowRoot!.children) as T | undefined;
  }

  applyTemplate(refName: string, count: number): ApplyTemplateResult {
    return this.#applyTemplateFromCollection(refName, count, this.shadowRoot!.childNodes);
  }

  #applyTemplateFromCollection(refName: string, count: number, childNodes: ChildNode[] | NodeListOf<ChildNode>): ApplyTemplateResult {
    const result: ApplyTemplateResult = [];
    const template = this.#getElementOfCollection(refName, [...childNodes]);
    const parent = template?.parentNode;
    if (parent === undefined || parent === null || !(template instanceof HTMLTemplateElement)) {
      return [];
    }

    const existingChildNodes: ChildNode[][] = [];
    let startComment: Comment | undefined = undefined;
    let contentNodes: ChildNode[] = [];

    for (const node of parent.childNodes) {
      if (node instanceof Comment && startComment === undefined && node.data.startsWith(`applyTemplate:${refName}:start:`)) {
        startComment = node;
      } else if (node instanceof Comment && startComment !== undefined && node.data.startsWith(`applyTemplate:${refName}:end:`)) {
        existingChildNodes.push([startComment, ...contentNodes, node]);
        startComment = undefined;
        contentNodes = [];
      } else if (startComment !== undefined) {
        contentNodes.push(node);
      }
    }

    if (existingChildNodes.length > count) {
      for (let i = count; i < existingChildNodes.length; i++) {
        existingChildNodes[i].forEach(n => n.remove());
      }
      existingChildNodes.splice(count);
    }

    for (let i = 0; i < count; i++) {
      let childNodes: ChildNode[] = [];

      if (existingChildNodes.length > i) {
        childNodes = existingChildNodes[i];
      } else {
        const startComment = document.createComment(`applyTemplate:${refName}:start:${i}`);
        const endComment = document.createComment(`applyTemplate:${refName}:end:${i}`);

        const clone = template.content.cloneNode(true);
        childNodes = [startComment, ...clone.childNodes, endComment];
      }

      result.push({
        childNodes,
        getElement: <T extends HTMLElement = HTMLElement>(refName: string): T | undefined => this.#getElementOfCollection(refName, childNodes) as T | undefined,
        applyTemplate: (refName, count) => this.#applyTemplateFromCollection(refName, count, childNodes)
      });

      childNodes.forEach(node => parent.appendChild(node));
    }
    return result;
  }

  #getElementOfCollection(refName: string, childNodes: ChildNode[] | HTMLCollection): HTMLElement | undefined {
    const search = (children: ChildNode[] | HTMLCollection): HTMLElement | undefined => {
      for (const child of children) {
        if (child instanceof HTMLElement) {
          if (child.dataset.ref === refName) {
            return child;
          } else {
            const searchResult = search(child.children);
            if (searchResult !== undefined) {
              return searchResult;
            }
          }
        }
      }
      return undefined;
    }
    return search(childNodes);
  }

  #parseStringToPropertyValue(value: string | null, property: Property): unknown {
    switch (property.type) {
      case String:
        return value === null ? null : String(value);
      case Boolean:
        return !!value || value === '';
      case Number:
        return value === null ? null : Number(value);
      default:
        return value;
    }
  }

}
