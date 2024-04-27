import {matchLanguage} from "@framework/content-negotiation";

declare global {
    interface Window {
        __app?: Record<string, any>
    }
}

export type LocaleStrings = Record<string, string | Record<string, string>>;

let strings: Record<string, LocaleStrings> = {};
let locales = new Set<string>();
let defaultLocale: string | undefined = undefined;

export function loadLocaleClient(): void {
    if (window.__app?.locales !== undefined) {
        strings = {};
        locales = new Set();
        defaultLocale = undefined;

        strings['compiled'] = window.__app.locales;
        locales.add('compiled');
    }
}

export function loadLocale(locale: string, localeStrings: object): void {
    strings[locale] ??= {};
    locales.add(locale);
    if (defaultLocale === undefined) {
        defaultLocale = locale;
    }

    const walker = (parts: string[], entries: object) => {
        for (const [key, value] of Object.entries(entries)) {
            const newParts = [...parts, key];
            if (typeof value === 'string') {
                strings[locale][newParts.join('.')] = value;
            } else if (key.endsWith('::plural')) {
                strings[locale][[...parts, key.substring(0, key.length - 8)].join('.')] = value;
            } else {
                walker(newParts, value);
            }
        }
    }
    walker([], localeStrings);
}

export function localeStrings(unicodeLocale: string | string[] | readonly string[]): LocaleStrings {
    if (locales.size === 0) {
        return {};
    } else if (defaultLocale === undefined) {
        return Object.values(strings)[0];
    }

    const locale = matchLanguage(unicodeLocale, [...locales])

    if (locale !== undefined) {
        return strings[locale];
    } else {
        return strings[defaultLocale];
    }
}

export function t(id: string, options?: {plural?: number | Record<string, number>, locale?: string | string[] | readonly string[]}): string {
    options ??= {};
    return translate(id, {locale: defaultLanguages(), ...options}) ?? id;
}

export function injectI18n(parent: HTMLElement): void {
    if (!parent.shadowRoot) {
        return;
    }
    const i18nElements: {
        element: Element;
        content: string | undefined;
        attributes: Record<string, string>
    }[] = [];

    for (const element of parent.shadowRoot.querySelectorAll('*')) {
        let content: string | undefined = undefined;
        let attributes: Record<string, string> = {};

        for (const attribute of element.attributes) {
            if (attribute.name === 'data-i18n') {
                content = element.textContent;
            } else if (attribute.name.startsWith('data-i18n-')) {
                const attributeName = attribute.name.substring(10);
                if (element.hasAttribute(attributeName)) {
                    attributes[attributeName] = element.getAttribute(attributeName);
                }
            }
        }

        if (content !== undefined || Object.keys(attributes).length > 0) {
            i18nElements.push({element, content, attributes});
        }
    }

    for (const i18nElement of i18nElements) {
        if (i18nElement.content !== undefined) {
            const translation = translate(i18nElement.content, {locale: defaultLanguages()});
            if (translation !== undefined) {
                i18nElement.element.textContent = translation;
                i18nElement.element.removeAttribute('data-i18n');
            }
        }
        for (const [name, id] of Object.entries(i18nElement.attributes)) {
            const translation = translate(id, {locale: defaultLanguages()});
            if (translation !== undefined) {
                i18nElement.element.setAttribute(name, translation);
                i18nElement.element.removeAttribute(`data-i18n-${name}`);
            }
        }
    }
}

function translate(id: string, options: {plural?: number | Record<string, number>, locale: string | string [] | readonly string[]}): string | undefined {
    const compiledLocaleStrings = localeStrings(options.locale);
    if (id in compiledLocaleStrings) {
        const stringValue = compiledLocaleStrings[id];
        if (typeof stringValue === 'string') {
            return stringValue;
        } else {
            const pluralSet = new Map<string, string>();
            const keyNames = new Set<string>();
            for (const key of Object.keys(stringValue)) {
                let setKey: Record<string, string> = {};
                const parts = key.split(' ');
                for (const part of parts) {
                    const [varName, count] = part.split(':');
                    keyNames.add(varName);
                    setKey[varName] = count;
                }
                setKey = Object.keys(setKey).sort().reduce((acc, key) => {acc[key] = setKey[key]; return acc}, {});
                pluralSet.set(JSON.stringify(setKey), stringValue[key]);
            }

            const rules = new Intl.PluralRules();
            const format = new Intl.NumberFormat();
            options.plural ??= 0;

            let setKey: Record<string, string> = {};
            let pluralValues: Record<string, string> = {};
            if (typeof options.plural === 'number') {
                const plural = rules.select(options.plural);
                for (const keyName of keyNames) {
                    setKey[keyName] = plural;
                    pluralValues[keyName] = format.format(options.plural);
                }
            } else {
                for (const keyName of keyNames) {
                    setKey[keyName] = rules.select(options.plural[keyName] ?? 0);
                    pluralValues[keyName] = format.format(options.plural[keyName] ?? 0);
                }
            }
            setKey = Object.keys(setKey).sort().reduce((acc, key) => {acc[key] = setKey[key]; return acc}, {});

            const pluralizedString = pluralSet.get(JSON.stringify(setKey));
            return applyPlaceholder(pluralizedString, pluralValues);
        }
    }
    return undefined;
}

function applyPlaceholder(templateString: string, values: Record<string, string>): string {
    for (const [key, value] of Object.entries(values)) {
        templateString = templateString.replace(`{${key}}`, value);
    }
    return templateString;
}

function defaultLanguages(): readonly string[] | string[] {
    if (typeof navigator !== 'undefined') {
        return navigator.languages ?? [];
    }
    return [];
}