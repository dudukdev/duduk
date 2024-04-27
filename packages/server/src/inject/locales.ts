import {localeStrings} from "@framework/localization";

export function getLocaleStrings(locale: string | string[] | readonly string[]): Record<string, string | Record<string, string>> {
    return localeStrings(locale);
}