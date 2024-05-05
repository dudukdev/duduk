import {beforeEach, describe, expect, test, vi} from "vitest";
import {WebComponent} from "./webcomponent";
import {html} from "./html";
import {css} from "./css";

let counter = 0;

beforeEach(() => {
  counter++;
});

describe('instantiation', () => {
  test('cannot instantiate directly', () => {
    window.customElements.define(`test-component-${counter}`, WebComponent);
    expect(() => new WebComponent()).toThrowError('Class WebComponent is an abstract class and cannot be used directly as component');
  });

  test('can be instantiated through other class', () => {
    const Component = class extends WebComponent {};
    window.customElements.define(`test-component-${counter}`, Component);

    expect(() => new Component()).not.toThrowError();
  });
});

describe('template and styles', () => {
  test('set template as shadow dom', () => {
    const Component = class extends WebComponent {
      static template = html`<p>This is a template</p>`;
    };
    const compoName = `test-component-${counter}`;
    window.customElements.define(compoName, Component);
    const component = document.createElement(compoName);

    expect(component.shadowRoot).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toEqual('<p>This is a template</p>');
  });

  test('set styles in shadow dom', () => {
    const Component = class extends WebComponent {
      static styles = css`p {color: red}`;
    };
    const compoName = `test-component-${counter}`;
    window.customElements.define(compoName, Component);
    const component = document.createElement(compoName);

    expect(component.shadowRoot).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toEqual('<style>p {color: red}</style>');
  });

  test('do not set shadow dom content if no template and styles defined', () => {
    const Component = class extends WebComponent {};
    window.customElements.define(`test-component-${counter}`, Component);

    const component = new Component();

    expect(component.shadowRoot).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toEqual('');
  });

  test('set styles and template in shadow dom', () => {
    const Component = class extends WebComponent {
      static template = html`<p>This is a template</p>`;
      static styles = css`p {color: red}`;
    };
    window.customElements.define(`test-component-${counter}`, Component);

    const component = new Component();

    expect(component.shadowRoot).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toEqual('<style>p {color: red}</style><p>This is a template</p>');
  });
});

describe('properties', () => {
  test('set properties as observedAttributes', () => {
    const Component = class extends WebComponent {
      static properties = {
        myProp: {type: String}
      };
    };
    expect(Component.observedAttributes).toEqual(['myProp']);
  });

  test('call setter via instance property', () => {
    const setterFn = vi.fn();
    const Component = class extends WebComponent {
      static properties = {
        myProp: {type: String}
      };
      set myProp(value: string | null) {
        setterFn(value);
      }
    };
    window.customElements.define(`test-component-${counter}`, Component);

    const component = new Component();
    component.myProp = 'hello world';

    expect(setterFn).toHaveBeenCalledOnce();
    expect(setterFn).toHaveBeenCalledWith('hello world');
  });

  describe('call setter via setAttribute and removeAttribute', () => {
    // Fails because it seems that JSDOM does not support attributeChangedCallback

    test.fails('String property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: String}
        };
        set myProp(value: string | null) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.setAttribute('myProp', 'hello world');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith('hello world');

      component.removeAttribute('myProp');

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(null);
    });

    test.fails('Number property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: Number}
        };
        set myProp(value: number | null) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.setAttribute('myProp', '42');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith(42);

      component.removeAttribute('myProp');

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(null);
    });

    test.fails('Boolean property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: Boolean}
        };
        set myProp(value: boolean) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.setAttribute('myProp', '');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith(true);

      component.removeAttribute('myProp');

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(false);
    });

    test.fails('Object property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: Object}
        };
        set myProp(value: object) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.setAttribute('myProp', 'something');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith('something');

      component.removeAttribute('myProp');

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(null);
    });
  });

  describe('call setter via attributeChangedCallback', () => {
    // Can be removed if setAttribute and removeAttribute tests work

    test('String property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: String}
        };
        set myProp(value: string | null) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.attributeChangedCallback('myProp', '', 'hello world');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith('hello world');

      component.attributeChangedCallback('myProp', '', null);

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(null);
    });

    test('Number property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: Number}
        };
        set myProp(value: number | null) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.attributeChangedCallback('myProp', '', '42');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith(42);

      component.attributeChangedCallback('myProp', '', null);

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(null);
    });

    test('Boolean property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: Boolean}
        };
        set myProp(value: boolean) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.attributeChangedCallback('myProp', '', '');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith(true);

      component.attributeChangedCallback('myProp', '', null);

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(false);
    });

    test('Object property', () => {
      const setterFn = vi.fn();
      const Component = class extends WebComponent {
        static properties = {
          myProp: {type: Object}
        };
        set myProp(value: object) {
          setterFn(value);
        }
      };
      window.customElements.define(`test-component-${counter}`, Component);

      const component = new Component();
      component.attributeChangedCallback('myProp', '', 'something');

      expect(setterFn).toHaveBeenCalledOnce();
      expect(setterFn).toHaveBeenCalledWith('something');

      component.attributeChangedCallback('myProp', '', null);

      expect(setterFn).toHaveBeenCalledTimes(2);
      expect(setterFn).toHaveBeenLastCalledWith(null);
    });
  });
});

describe('helper methods', () => {
  describe('getElement', () => {
    test('return element from template', () => {
      const Component = class extends WebComponent {
        static template = html`<p>This is a <span data-ref="myRef">nice</span> template</p>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const element = component.getElement('myRef');
      expect(element).instanceof(HTMLSpanElement);
      expect(element?.dataset.ref).toEqual('myRef');
      expect(element?.textContent).toEqual('nice');
    });

    test('return undefined if ref not exists', () => {
      const Component = class extends WebComponent {
        static template = html`<p>This is a <span data-ref="myRef">nice</span> template</p>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const element = component.getElement('otherRef');
      expect(element).toBeUndefined();
    })
  });

  describe('applyTemplate', () => {
    test('apply template 2 times', () => {
      const Component = class extends WebComponent {
        static template = html`<template data-ref="myRef">This is a template</template>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const templates = component.applyTemplate('myRef', 2);
      expect(templates).toHaveLength(2);
      expect(templates[0].childNodes).toHaveLength(3);
      expect(templates[0].childNodes[1].textContent).toEqual('This is a template');
      expect(templates[1].childNodes).toHaveLength(3);
      expect(templates[1].childNodes[1].textContent).toEqual('This is a template');
      expect(component.shadowRoot?.innerHTML).toEqual('<template data-ref="myRef">This is a template</template><!--applyTemplate:myRef:start:0-->This is a template<!--applyTemplate:myRef:end:0--><!--applyTemplate:myRef:start:1-->This is a template<!--applyTemplate:myRef:end:1-->');
    });

    test('apply template 1 and then 2 times and do not recreate first elements', () => {
      const Component = class extends WebComponent {
        static template = html`<template data-ref="myRef">This is a template</template>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const templatesFirst = component.applyTemplate('myRef', 1);
      const templatesSecond = component.applyTemplate('myRef', 2);

      expect(templatesFirst).toHaveLength(1);
      expect(templatesSecond).toHaveLength(2);
      expect(templatesFirst[0].childNodes[1]).toBe(templatesSecond[0].childNodes[1]);
    });

    test('apply template 2 and then 1 times and keep first elements', () => {
      const Component = class extends WebComponent {
        static template = html`<template data-ref="myRef">This is a template</template>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const templatesFirst = component.applyTemplate('myRef', 2);
      const templatesSecond = component.applyTemplate('myRef', 1);

      expect(templatesFirst).toHaveLength(2);
      expect(templatesSecond).toHaveLength(1);
      expect(templatesFirst[0].childNodes[1]).toBe(templatesSecond[0].childNodes[1]);
    });

    test('getElement inside applied template', () => {
      const Component = class extends WebComponent {
        static template = html`<template data-ref="myRef">This is a <span data-ref="otherRef"></span> template</template>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const templates = component.applyTemplate('myRef', 2);
      templates[1].getElement('otherRef')!.textContent = 'nice';

      expect(component.shadowRoot?.innerHTML).toEqual('<template data-ref="myRef">This is a <span data-ref="otherRef"></span> template</template><!--applyTemplate:myRef:start:0-->This is a <span data-ref="otherRef"></span> template<!--applyTemplate:myRef:end:0--><!--applyTemplate:myRef:start:1-->This is a <span data-ref="otherRef">nice</span> template<!--applyTemplate:myRef:end:1-->');
    });

    test('applyTemplate inside applied template', () => {
      const Component = class extends WebComponent {
        static template = html`<template data-ref="myRef">This is a <span><template data-ref="otherRef">nice</template></span> template</template>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const templates = component.applyTemplate('myRef', 2);
      templates[1].applyTemplate('otherRef', 1);

      expect(component.shadowRoot?.innerHTML).toEqual('<template data-ref="myRef">This is a <span><template data-ref="otherRef">nice</template></span> template</template><!--applyTemplate:myRef:start:0-->This is a <span><template data-ref="otherRef">nice</template></span> template<!--applyTemplate:myRef:end:0--><!--applyTemplate:myRef:start:1-->This is a <span><template data-ref="otherRef">nice</template><!--applyTemplate:otherRef:start:0-->nice<!--applyTemplate:otherRef:end:0--></span> template<!--applyTemplate:myRef:end:1-->');
    });

    test('do nothing if data-ref is not a template', () => {
      const Component = class extends WebComponent {
        static template = html`<span data-ref="myRef">This is a template</span>`;
      };
      window.customElements.define(`test-component-${counter}`, Component);
      const component = new Component();

      const templates = component.applyTemplate('myRef', 2);
      expect(templates).toHaveLength(0);
    });
  });
});
