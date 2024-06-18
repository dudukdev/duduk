# Server Types

## LayoutServerDataFunction

```typescript
function<TData>(params: { request: IncomingMessage; data: TData }): Promise<object>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `data: <TData>`
  : Cumulated data from the layoutServer data functions, or an empty object if first layoutServer data function.

Return Value
: Data, that will be merged with the data from the previous layoutServer data functions, and send to the next layoutServer or pageServer data function.

## LayoutServerHttpFunction

```typescript
function<TData>(params: { request: IncomingMessage; data: TData }): Promise<object>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `data: <TData>`
  : Cumulated data from the previous layoutServer HTTP functions, or an empty object if first layoutServer HTTP function.

Return Value
: Data, that will be merged with the data from the previous layoutServer HTTP functions, and send to the next layoutServer or pageServer HTTP function.

## PageServerDataFunction

```typescript
function<TData>(params: { request: IncomingMessage; data: TData }): Promise<object>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `data: <TData>`
  : Cumulated data from the previous layoutServer data functions, or empty object if no previous layoutServer data functions exists. 

Return Value
: Data, that will be merged with the data from the layoutServer data functions, and send to the page.

## PageServerHttpFunction

```typescript
function<TData>(params: { request: IncomingMessage; response: ServerResponse; data: TData; params: Record<string, string> }): Promise<void>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `response: ServerResponse`
  : Response object that will be returned from the webserver

  `data: <TData>`
  : Cumulated data from the layoutServer HTTP functions

