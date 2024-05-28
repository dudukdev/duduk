import {afterEach, beforeEach, expect, test, vi} from "vitest";
import fs from "node:fs";
import {ssr} from "./ssr";

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn()
  }
}));

beforeEach(() => {
  vi.mocked(fs.readFileSync).mockImplementation((path) => {
    switch (path) {
      case `${import.meta.dirname}/__app/my-component.js`:
        return `
import something from './dir/something.js';
export default class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = \`\${something}<p>Some outer component content</p><slot></slot>\`;
  }
}
`;
      case `${import.meta.dirname}/__app/my-other-component.js`:
        return `
import something from './dir/something.js';
export default class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = \`\${something}<slot></slot><p>lang \${JSON.stringify(window.navigator.languages)}</p><p>__app \${JSON.stringify(window.__app)}</p><p>url \${window.location.href}</p>\`;
  }
}
`;
    case `${import.meta.dirname}/__app/my-component-without-show-root.js`:
      return `export default class extends HTMLElement {}`;
      case `${import.meta.dirname}/__app/dir/something.js`:
        return `const something = 'imported content'; export default something;`;
      default:
        return '';
    }
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

test('render HTML', async () => {
  const mockHtml = `
<my-component><my-other-component>Some inner content</my-other-component></my-component>
<my-component-without-show-root><template>some template</template></my-component-without-show-root>
<my-component-without-show-root><template shadowrootmode="open">shadow content</template></my-component-without-show-root>
<my-component-without-show-root></my-component-without-show-root>
<my-component><template shadowrootmode="open">shadow content</template></my-component>
`;
  const mockJs = `
    import MyComponent from '/__app/my-component.js';
    import MyOtherComponent from '/__app/my-other-component.js';
    import MyComponentWithoutShadowRoot from '/__app/my-component-without-show-root.js';
    customElements.define('my-component', MyComponent);
    customElements.define('my-other-component', MyOtherComponent);
    customElements.define('my-component-without-show-root', MyComponentWithoutShadowRoot);
  `;
  const mockGlobals = {some: 'global'};
  const mockLanguages = ['de-DE', 'en-US'];
  const mockUrl = 'http://localhost/someRoute';

  const result = await ssr(mockHtml, mockJs, mockGlobals, mockLanguages, mockUrl);

  expect(result).toEqual(`<my-component><template shadowrootmode="open">imported content<p>Some outer component content</p><slot></slot></template><my-other-component><template shadowrootmode="open">imported content<slot></slot><p>lang ["de-DE","en-US"]</p><p>__app {"some":"global"}</p><p>url http://localhost/someRoute</p></template>Some inner content</my-other-component></my-component>
<my-component-without-show-root><template>some template</template></my-component-without-show-root>
<my-component-without-show-root><template shadowrootmode="open">shadow content</template></my-component-without-show-root>
<my-component-without-show-root></my-component-without-show-root>
<my-component><template shadowrootmode="open">shadow content</template></my-component>
`);

  expect(fs.readFileSync).toHaveBeenCalledTimes(4);
  expect(fs.readFileSync).toHaveBeenNthCalledWith(1, `${import.meta.dirname}/__app/my-component.js`, {encoding: 'utf-8'});
  expect(fs.readFileSync).toHaveBeenNthCalledWith(2, `${import.meta.dirname}/__app/dir/something.js`, {encoding: 'utf-8'});
  expect(fs.readFileSync).toHaveBeenNthCalledWith(3, `${import.meta.dirname}/__app/my-other-component.js`, {encoding: 'utf-8'});
  expect(fs.readFileSync).toHaveBeenNthCalledWith(4, `${import.meta.dirname}/__app/my-component-without-show-root.js`, {encoding: 'utf-8'});
});
