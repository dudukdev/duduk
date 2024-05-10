declare global {
    interface Window {
        __app?: Record<string, any>
    }
}

export type {LocaleStrings, AcceptLocale} from './src/data';
export {loadLocale, loadLocaleClient} from './src/loadLocales';
export {injectI18n} from './src/inject';
export {t} from './src/translate';
export {localeStrings} from './src/export';
