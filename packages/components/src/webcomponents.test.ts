/*
Test:
- Styles
  - Styles are set inside ShadowDOM
  - ShadowDOM is not overridden with template if already present
- Properties
  - Properties are set as observedAttributes
  - Setter method is called
    - if set via instance property
    - if set via setAttribute and removeAttribute
    - for String, Number, Boolean, Object
- Helper methods
  - getElement
  - applyTemplate

 */

import {beforeEach, describe, expect, test} from "vitest";
import {WebComponent} from "./webcomponent";
import {html} from "./html";
import {JSDOM} from "jsdom";

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
    const Component = class extends WebComponent {}
    window.customElements.define(`test-component-${counter}`, Component);

    expect(() => new Component()).not.toThrowError();
  });
});

describe('template', () => {
  test('set template as shadow dom', () => {
    const Component = class extends WebComponent {
      static template = html`<p>This is a template</p>`;
    }
    const compoName = `test-component-${counter}`;
    window.customElements.define(compoName, Component);
    const component = document.createElement(compoName);

    expect(component.shadowRoot).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toEqual('<p>This is a template</p>');
  });

  test('do not set shadow dom content if no template defined', () => {
    const Component = class extends WebComponent {}
    window.customElements.define(`test-component-${counter}`, Component);

    const component = new Component();

    expect(component.shadowRoot).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toEqual('');
  });
});
