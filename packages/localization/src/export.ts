import {data, type LocaleStrings} from "./data";
import {matchLanguage} from "@framework/content-negotiation";

export function localeStrings(unicodeLocale: string | string[] | readonly string[]): LocaleStrings {
  if (data.locales.size === 0) {
    return {};
  } else if (data.defaultLocale === undefined) {
    return Object.values(data.strings)[0];
  }

  const locale = matchLanguage(unicodeLocale, [...data.locales])

  if (locale !== undefined) {
    return data.strings[locale];
  } else {
    return data.strings[data.defaultLocale];
  }
}
