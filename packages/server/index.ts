declare global {
  interface Window {
    __duduk?: Record<string, any>
  }
}

export type {CookieHandler} from './src/server/serve-route/cookies';
export type {
  PageServerDataFunction,
  PageServerHttpFunction,
  LayoutServerDataFunction,
  LayoutServerHttpFunction,
  MiddlewareEvent,
  ResolveFunction,
  Middleware,
  Middlewares
} from './src/server/serve-route/models';
export {getData, getParams} from './src/client/getter';
