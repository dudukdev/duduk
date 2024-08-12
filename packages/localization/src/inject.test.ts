// @vitest-environment jsdom
import {beforeEach, expect, test, vi} from "vitest";
import {data} from "./data";
import {defaultLanguages} from "./defaultLanguage";
import {WebComponent} from "@duduk/components/src/webcomponent";
import {injectI18n} from "./inject";

vi.mock('./defaultLanguage', () => ({defaultLanguages: vi.fn()}));

let counter = 0;

beforeEach(() => {
  counter++;
  vi.mocked(defaultLanguages).mockReturnValue(['en-US']);

  data.strings.clear();
  data.strings.set('en', {i18nId: 'This is a text'});
  data.defaultLocale = 'en';
});

test('inject translation into shadow dom element content', () => {
  const Component = class extends WebComponent {};
  window.customElements.define(`test-component-${counter}`, Component);
  const element = new Component();

  element.shadowRoot!.innerHTML = '<p data-i18n>i18nId</p>';

  injectI18n(element);

  expect(element.shadowRoot?.innerHTML).toEqual('<p>This is a text</p>');
});

test('inject translation into shadow dom element attribute', () => {
  const Component = class extends WebComponent {};
  window.customElements.define(`test-component-${counter}`, Component);
  const element = new Component();

  element.shadowRoot!.innerHTML = '<p data-i18n-title title="i18nId"></p>';

  injectI18n(element);

  expect(element.shadowRoot?.innerHTML).toEqual('<p title="This is a text"></p>');
});

test('inject translation into template element inside shadow dom', () => {
  const Component = class extends WebComponent {};
  window.customElements.define(`test-component-${counter}`, Component);
  const element = new Component();

  element.shadowRoot!.innerHTML = '<template><p data-i18n>i18nId</p></template>';

  injectI18n(element);

  expect(element.shadowRoot?.innerHTML).toEqual('<template><p>This is a text</p></template>');
});

test('inject translation into template element attribute inside shadow dom', () => {
  const Component = class extends WebComponent {};
  window.customElements.define(`test-component-${counter}`, Component);
  const element = new Component();

  element.shadowRoot!.innerHTML = '<template><p data-i18n-title title="i18nId"></p></template>';

  injectI18n(element);

  expect(element.shadowRoot?.innerHTML).toEqual('<template><p title="This is a text"></p></template>');
});

test('do not change other than shadow dom', () => {
  const Component = class extends WebComponent {};
  window.customElements.define(`test-component-${counter}`, Component);
  const element = new Component();

  element.shadowRoot!.innerHTML = '<p data-i18n data-i18n-title title="i18nId">i18nId</p>';
  element.innerHTML = '<p data-i18n data-i18n-title title="i18nId">i18nId</p>';

  injectI18n(element);

  expect(element.innerHTML).toEqual('<p data-i18n="" data-i18n-title="" title="i18nId">i18nId</p>');
});

test('change nothing if no content', () => {
  const Component = class extends HTMLElement {};
  window.customElements.define(`test-component-${counter}`, Component);
  const element = new Component();

  injectI18n(element);

  expect(element.shadowRoot).toBeNull();
  expect(element.innerHTML).toEqual('');
});
