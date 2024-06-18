import {type AcceptLocale, data, type LocaleStrings} from "./data";
import {matchLanguage} from "@duduk/content-negotiation";

export function localeStrings(unicodeLocale: AcceptLocale): {strings: LocaleStrings; locale: string} {
  if (data.strings.size === 0 || data.defaultLocale === undefined) {
    return {strings: {}, locale: ''};
  }

  const locale = matchLanguage(unicodeLocale, [...data.strings.keys()])

  if (locale !== undefined) {
    const localeStrings = {...data.strings.get(locale)};
    const localeStringsKey = Object.keys(localeStrings);
    const defaultLocaleKeys = Object.keys(data.strings.get(data.defaultLocale)!).filter(s => !localeStringsKey.includes(s));
    for (const defaultLocaleKey of defaultLocaleKeys) {
      localeStrings[defaultLocaleKey] = data.strings.get(data.defaultLocale)![defaultLocaleKey];
    }
    return {strings: localeStrings, locale: locale};
  } else {
    return {strings: data.strings.get(data.defaultLocale)!, locale: data.defaultLocale};
  }
}
