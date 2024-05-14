import type {LocaleStrings, AcceptLocale} from "@duduk/localization";
import {localeStrings} from "@duduk/localization";

export function getLocaleStrings(locale: AcceptLocale): LocaleStrings {
    return localeStrings(locale).strings;
}
