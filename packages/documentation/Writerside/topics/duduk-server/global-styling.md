# Global Styling

Duduk supports two types of global styles. This is because Duduk Components are based von JavaScript WebComponents. WebComponents are using a technique called Shadow DOM. Shadow DOM encapsulates all styles from outside the components. Therefore, most styles you define outside a Duduk Component are not working inside a Duduk Component.

## `root.css`

Create a `root.css` file in the `src` directory of your project. These styles are applied once at global level in the browser. You can use this file for example to load fonts and define CSS Custom Properties.

## `app.css`

Create an `app.css` file in the `src` directory of your project. These styles are injected in every Duduk Component. Use this file for styles that have to be available in every or most Duduk Components.

