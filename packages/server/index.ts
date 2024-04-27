declare global {
  interface Window {
    __app?: Record<string, any>
  }
}

export type {PageServerDataFunction, PageServerHttpFunction, LayoutServerDataFunction, LayoutServerHttpFunction} from './src/server/serve-route/models';
export {getData, getParams} from './src/getter';
