declare global {
  interface Window {
    __duduk?: Record<string, any>
  }
}

export {css} from './src/css';
export {html} from './src/html';
export {WebComponent, type ApplyTemplateResult, type Property, type Properties} from './src/webcomponent';
