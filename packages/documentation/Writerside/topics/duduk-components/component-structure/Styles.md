# Styles

<show-structure for="chapter,procedure" depth="2"/>

The `styles` block contains normal CSS. The styles are added to the Shadow DOM of the component. There the styles are encapsulated from the rest of the page, and the styles from the rest of the page are mostly encapsulated from the component.

```javascript
static styles = css`
    /* CSS */
`;
```

CSS properties, that are inheritable, can leak into components, as well as CSS custom properties. You can either disable all leaking with the CSS rule `all: initial`, or you can exclude specific properties from leaking, for example `font-size: initial`. 

<procedure title="Styling component itself">
    <code-block lang="typescript">
    <![CDATA[
        static styles = css`
            :host {
                display: block;
            }
        `;
    ]]>
    </code-block>
</procedure>

## Global styles

If you use Duduk Server and need styles that are applied to all your components, see [Global Styling](global-styling.md) for more information.
