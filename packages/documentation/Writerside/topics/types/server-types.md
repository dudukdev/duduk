# Server Types

## LayoutServerDataFunction

```typescript
async function<TData>(params: { request: IncomingMessage; data: TData; params: Record<string, string>; locals: App.Locals }): Promise<object>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `data: <TData>`
  : Cumulated data from the layoutServer data functions, or an empty object if first layoutServer data function.

  `params: Record<string, string>`
  : Values from dynamic route parts

  `locals: App.Locals`
  : Data cumulated from middlewares

Return Value
: Data, that will be merged with the data from the previous layoutServer data functions, and send to the next layoutServer or pageServer data function.

## LayoutServerHttpFunction

```typescript
async function<TData>(params: { request: IncomingMessage; data: TData; params: Record<string, string>; locals: App.Locals }): Promise<object>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `data: <TData>`
  : Cumulated data from the previous layoutServer HTTP functions, or an empty object if first layoutServer HTTP function.


  `params: Record<string, string>`
  : Values from dynamic route parts

  `locals: App.Locals`
  : Data cumulated from middlewares

Return Value
: Data, that will be merged with the data from the previous layoutServer HTTP functions, and send to the next layoutServer or pageServer HTTP function.

## Middlewares

```typescript
type Middlewares = Middleware[];

// Middleware
async function(params: { event: MiddlewareEvent; resolve: ResolveFunction; response: ServerResponse }) => Promise<ServerResponse>;
```

Parameter `params`
: `event: {request: IncomingMessage; params: Record<string, string>; locals: App.Locals}`
  : Data given to the middleware

    `request: IncomingMessage`
    : Node Request
    
    `params: Record<string, string>`
    : Values from dynamic route parts

    `locals: App.Locals`
    : Object in which you can store any data. These data can be accessed by a later middleware or layout data function or page data function.
  
  `resolve: function(event: MiddlewareEvent) => Promise<ServerResponse>`
  : Function that has to be called to continue the request chain. Pass the `event` parameter as is to this function.

  `response: ServerResponse`
  : Response object. If you want to abort the request chain, return this object without calling the `resolve()` function.

Return Value
: ServerResponse

## PageServerDataFunction

```typescript
async function<TData>(params: { request: IncomingMessage; data: TData; params: Record<string, string>; locals: App.Locals }): Promise<object>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `data: <TData>`
  : Cumulated data from the previous layoutServer data functions, or empty object if no previous layoutServer data functions exists.


  `params: Record<string, string>`
  : Values from dynamic route parts

  `locals: App.Locals`
  : Data cumulated from middlewares

Return Value
: Data, that will be merged with the data from the layoutServer data functions, and send to the page.

## PageServerHttpFunction

```typescript
async function<TData>(params: { request: IncomingMessage; response: ServerResponse; data: TData; params: Record<string, string>; locals: App.Locals }): Promise<void>;
```

Parameter `params`
: `request: IncomingMessage`
  : Node Request

  `response: ServerResponse`
  : Response object that will be returned from the webserver

  `data: <TData>`
  : Cumulated data from the layoutServer HTTP functions

  `params: Record<string, string>`
  : Values from dynamic route parts

  `locals: App.Locals`
  : Data cumulated from middlewares

