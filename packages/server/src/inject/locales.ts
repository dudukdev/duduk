import type {LocaleStrings} from "@duduk/localization";
import {localeStrings} from "@duduk/localization";

export function getLocaleStrings(locale: string | string[] | readonly string[]): LocaleStrings {
    return localeStrings(locale);
}
