declare global {
  interface Window {
    __app?: Record<string, any>
  }
}

export {css} from './src/css';
export {html} from './src/html';
export {WebComponent, type ApplyTemplateResult, type Properties} from './src/webcomponent';
