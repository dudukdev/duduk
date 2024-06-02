# Dynamic Component Creation

Since Duduk components are standard JavaScript components, you can easily instantiate Duduk components inside JavaScript and add them to the DOM later. Also, you can add slot content to the instantiated component before or after added to the DOM. A Duduk component has the same DOM APIs then any normal HTMLElement.

```javascript
const component = new MyDudukComponent();

component.appendChild(document.createElement('div'));
component.innerHTML = '<div></div>';

document.body.appendChild(component);
```
