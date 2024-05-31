# Data Exchange

> This article covers native JavaScript functionality
>
{style="note"}

There are several ways to exchange data between components.

## Send data from parent to child

To send data from a parent component to a child component, you can define [Properties](Properties.md) on the child component. When setting data to such a Property, the child components property setter is being called.

## Send data from child to parent

To send data from a child component to a parent component, you can use JavaScript Events. JavaScript Events can send data either just to the direct parent, or to any superior parent.

To send an event to the parent components, dispatch a CustomEvent.

```javascript
// Child Component
const event = new CustomEvent('myEvent');
this.dispatchEvent(event);

// Parent Component
componentInstance.addEventListener('myEvent', () => {
  // handle event
}});
```

You can set several options to the CustomEvent in the constructor.

```javascript
new CustomEvent('myEvent', { /* Options */ }});
```

**Options**

bubbles
: A boolean value indicating whether the event bubbles. The default is `false`.

cancelable
: A boolean value indicating whether the event can be cancelled. The default is `false`.

composed
: A boolean value indicating whether the event will trigger listeners outside of a shadow root (see [Event.composed](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) for more details). The default is `false`.

detail
: An event-dependent value associated with the event. This value is then available to the handler using the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) property. It defaults to `null`.

## Exchange data globally

To exchange data not only between child and parent components, you can use custom events, also. The difference is that you either set the `bubbles` option to `true`, or dispatch them directly on the `body` element. Either way, add an event listener to the `body` element to listen to this events.

```javascript
// Some component
const event = new CustomEvent('myEvent', {bubbles: true}});
this.dispatchEvent(event);
  // or
const event = new CustomEvent('myEvent'});
document.body.dispatchEvent(event);

// Other component
document.body.addEventListener('myEvent', () => {
  // handle event
}});
```

If this way does not fit you needs, try out the package [`@duduk/messaging`](duduk-messaging.md). This package provides more capabilities for global data exchange.
