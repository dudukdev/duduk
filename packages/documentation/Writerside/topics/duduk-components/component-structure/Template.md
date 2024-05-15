# Template

<show-structure for="chapter,procedure" depth="2"/>

The `template` block contains normal HTML. The template is injected as Shadow DOM into the web component. You can access the Shadow DOM through `this.shadowRoot`. There are also several functions to easily interact with the HTML elements in the template.

```javascript
static template = html`
    <!-- HTML -->
`;
```

## getElement()

```typescript
getElement<T extends HTMLElement = HTMLElement>(refName: string): T | undefined
```

With the `getElement()` function you can get HTML elements from the template. Add `data-ref` attributes to HTML elements as `refName`;

<procedure title="Example">
    <code-block lang="typescript">
    <![CDATA[
        static template = html`
            <p data-ref="myElem"></p>
        `;

        connectedCallback() {
            const element = this.getElement<HTMLParagraphElement>('myElem');
            element.innerText = 'Hello, World!';
        }
    ]]>
    </code-block>
</procedure>

## applyTemplate()

```typescript
applyTemplate(refName: string, count: number): ApplyTemplateResult

type ApplyTemplateResult = {
    childNodes: ChildNode[];
    getElement: <T extends HTMLElement = HTMLElement>(refName: string) => (T | undefined);
    applyTemplate: (refName: string, count: number) => ApplyTemplateResult;
}[];
```

With the `applyTemplate()` function you can copy the content of a `<template>` element multiple times. If you execute the function multiple times, you can dynamically change the number of copies between 0 and any number. The function returns an array of objects, that contains references of the copied elements and the `getElement()` and `applyTemplate()` functions, with the copied element as basis.

<procedure title="if-else Example">
    <code-block lang="typescript">
    <![CDATA[
        static template = html`
            <template data-ref="myElem">Template Content</template>
        `;
        
        connectedCallback() {
            if (condition) {
                this.applyTemplate('myElem', 1);
            } else {
                this.applyTemplate('myElem', 0);
            }
        }
    ]]>
    </code-block>
</procedure>

<procedure title="for-loop Example">
    <code-block lang="typescript">
    <![CDATA[
        static template = html`
            <template data-ref="myElem">
                Template Content
                <span data-ref="counter"></span>
            </template>
        `;
    
        connectedCallback() {
            const elements = this.applyTemplate('myElem', 3);
            for (let i = 0; i < elements.length; i++) {
                elements[i].getElement('counter').innerText = `${i}`;
            }
        }
    ]]>
    </code-block>
</procedure>
