# Create Component

<link-summary>Create components based on native web components.</link-summary>

> It is best practice to create individual files for each component.
> 
{style="note"}

Basically, this library is just an extension to native web components. Native web components are sometimes cumbersome to use. Therefore this library creates an abstraction layer above the native web component APIs.

## Component structure

Each component is a JavaScript class, which extends from `WebComponent`.

```javascript
import {WebComponent, html, css} from "@framework/components";

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
import {WebComponent, html} from "@framework/components";
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

constructor
: The constructor is called first after the element has been instantiated.
```javascript
constructor() {
    super();
    // custom code
}
```

connectedCallback
: Called each time the element is added to the document. The specification recommends that, as far as possible, developers should implement custom element setup in this callback rather than the constructor.
```javascript
connectedCallback() {
    // custom code
}
```

disconnectedCallback
: Called each time the element is removed from the document.
```javascript
disconnectedCallback() {
    // custom code
}
```

adoptedCallback
: Called each time the element is moved to a new document.
```javascript
adoptedCallback() {
    // custom code
}
```

