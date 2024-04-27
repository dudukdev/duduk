import type {LocaleStrings} from "@framework/localization/src/data";
import {localeStrings} from "@framework/localization";

export function getLocaleStrings(locale: string | string[] | readonly string[]): LocaleStrings {
    return localeStrings(locale);
}
