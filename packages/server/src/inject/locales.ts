import type {LocaleStrings} from "@duduk/localization";
import {localeStrings} from "@duduk/localization";
import type {AcceptLocale} from "@duduk/localization/src/data";

export function getLocaleStrings(locale: AcceptLocale): LocaleStrings {
    return localeStrings(locale).strings;
}
