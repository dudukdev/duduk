# Properties

<show-structure for="chapter" depth="2"/>

In the `properties` object, you define the properties, that you component has. With properties, you can inject data from the surrounding code into your component.

```typescript
static properties = {
    myProperty: {type: String}
};

type Properties = Record<string, { type: String | Boolean | Number | Object }>;
```

To get the value of a property, add a setter method to your component class.

```typescript
set myProperty(value: string | null) {
    // custom code
}
```

You can set the value of the property either through JavaScript or inside HTML (or via `setAttribute()`).

```html
<my-component myProperty="some value"></my-component>
```
```javascript
myComponentInstance.myProperty = 'some value';
myComponentInstance.setAttribute('myProperty', 'some value');
```

## Data Types

A property can be of type `String`, `Boolean`, `Number` or `Object`.

### String

```typescript
static properties = {
    myProperty: {type: String}
};

set myProperty(value: string | null) {
    // custom code
}
```
```typescript
myComponentInstance.setAttribute('myProperty', 'value');
myComponentInstance.myProperty = 'value';
```

### Boolean

If a boolean property is set via HTML attribute, the setter gets `true`, if the attribute is set to any value or just added, and `false`, if the attribute is removed.

```typescript
static properties = {
    myProperty: {type: Boolean}
};

set myProperty(value: boolean) {
    // custom code
}
```
```typescript
myComponentInstance.setAttribute('myProperty', ''); // --> true
myComponentInstance.removeAttribute('myProperty'); // --> false
myComponentInstance.myProperty = true;
```

### Number

```typescript
static properties = {
    myProperty: {type: Number}
};

set myProperty(value: number | null) {
    // custom code
}
```
```typescript
myComponentInstance.setAttribute('myProperty', '42');
myComponentInstance.myProperty = 42;
```

### Object

`Object` can be anything. If you set the value via HTML attribute, the value is always set as string. To set other data types, like objects or arrays, you have to set the value through JavaScript.

```typescript
static properties = {
    myProperty: {type: Object}
};

set myProperty(value: object | null) { // object, array, or anything you want
    // custom code
}
```
```typescript
myComponentInstance.myProperty = {some: 'value'};
myComponentInstance.myProperty = ['some', 'value'];
```
