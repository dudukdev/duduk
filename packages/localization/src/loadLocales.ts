import {data} from "./data";

export function loadLocaleClient(): void {
  if (window.__app?.locales !== undefined) {
    data.strings = {};
    data.locales = new Set();
    data.defaultLocale = undefined;

    data.strings['compiled'] = window.__app.locales;
    data.locales.add('compiled');
  }
}

export function loadLocale(locale: string, localeStrings: object): void {
  data.strings[locale] ??= {};
  data.locales.add(locale);
  if (data.defaultLocale === undefined) {
    data.defaultLocale = locale;
  }

  const walker = (parts: string[], entries: object) => {
    for (const [key, value] of Object.entries(entries)) {
      const newParts = [...parts, key];
      if (typeof value === 'string') {
        data.strings[locale][newParts.join('.')] = value;
      } else if (key.endsWith('::plural')) {
        data.strings[locale][[...parts, key.substring(0, key.length - 8)].join('.')] = value;
      } else {
        walker(newParts, value);
      }
    }
  }
  walker([], localeStrings);
}
