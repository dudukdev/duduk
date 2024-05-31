# Create Component

<link-summary>Create components based on native web components.</link-summary>
<show-structure for="chapter,procedure" depth="2"/>

> It is best practice to create individual files for each component.
> 
{style="tip"}

Basically, this library is just an extension to native web components. Native web components are sometimes cumbersome to use. Therefore this library creates an abstraction layer above the native web component APIs.

## Component structure

Each component is a JavaScript class, which extends from `WebComponent`.

```javascript
import {WebComponent, html, css} from "@duduk/components";

class MyComponent extends WebComponent {
    static template = html`
        <!-- HTML -->
    `;
    static styles = css`
        /* CSS */
    `;
    static properties = {};
}

window.customElements.define('my-component', MyComponent);
```

Each part inside the class is optional. So you can add template, styles or properties or not. You can write any normal HTML and CSS in the `template` and `styles` blocks. You find more information about these three blocks on the specific pages.

You have to register each component in the Custom Elements Registry. You should register the component directly after the component definition. But basically you can register the component anywhere else, also.

Since the `WebComponent` class itself extends from `HTMLElement`, you can access any properties from `HTMLElement` through `this`.s

## Use component

To use a component, you have to import the JavaScript file, in which you registered the component.

You can use a component directly in another component.

```javascript
import {WebComponent, html} from "@duduk/components";
import './my-component';

class OtherComponent extends WebComponent {
    static template = html`
        <my-component></my-component>
    `;
}

window.customElements.define('other-component', OtherComponent);
```

To use a component in an HTML file, you have to use a bundling tool, like Rollup, Vite, ESBuild or Unbuild.

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="/my-component-bundle.js"></script>
    </head>
    <body>
        <my-component></my-component>
    </body>
</html>
```

## Lifecycle methods

A web component has different lifecycle methods. These methods are all methods of the native web component API. Please do not use any other native lifecycle methods, since some of them are used from this library.

<procedure title="constructor">
    <p>The constructor is called first after the element has been instantiated.</p>
    <code-block lang="typescript">
    <![CDATA[
        constructor() {
            super();
            // custom code
        }
    ]]>
    </code-block>
</procedure>

<procedure title="connectedCallback">
    <p>Called each time the element is added to the document. The specification recommends that, as far as possible, developers should implement custom element setup in this callback rather than the constructor.</p>
    <code-block lang="typescript">
    <![CDATA[
        connectedCallback() {
            // custom code
        }
    ]]>
    </code-block>
</procedure>

<procedure title="disconnectedCallback">
    <p>Called each time the element is removed from the document.</p>
    <code-block lang="typescript">
    <![CDATA[
        disconnectedCallback() {
            // custom code
        }
    ]]>
    </code-block>
</procedure>

<procedure title="adoptedCallback">
    <p>Called each time the element is moved to a new document.</p>
    <code-block lang="typescript">
    <![CDATA[
        adoptedCallback() {
            // custom code
        }
    ]]>
    </code-block>
</procedure>
