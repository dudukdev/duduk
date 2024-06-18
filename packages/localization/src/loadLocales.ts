import {data} from "./data";

export function loadLocaleClient(): void {
  if (window.__duduk?.locales !== undefined) {
    data.strings.clear()
    data.strings.set('compiled', window.__duduk.locales);
    data.defaultLocale = 'compiled';
  }
}

export function loadLocale(locale: string, localeStrings: object): void {
  if (!data.strings.has(locale)) {
    data.strings.set(locale, {});
  }
  if (data.defaultLocale === undefined) {
    data.defaultLocale = locale;
  }

  const walker = (parts: string[], entries: object) => {
    for (const [key, value] of Object.entries(entries)) {
      const newParts = [...parts, key];
      if (typeof value === 'string') {
        data.strings.get(locale)![newParts.join('.')] = value;
      } else if (key.endsWith('::plural')) {
        data.strings.get(locale)![[...parts, key.substring(0, key.length - 8)].join('.')] = value;
      } else {
        walker(newParts, value);
      }
    }
  }
  walker([], localeStrings);
}
