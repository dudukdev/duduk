import type {AcceptLocale} from "@duduk/localization";
import {parseHeader} from "./parse";

export function matchLanguage(languages: AcceptLocale, availableLocales: string[]): string | undefined {
    if (typeof languages === 'string') {
        const entries = parseHeader(languages);
        languages = entries.map(e => e.value);
    }

    for (const language of languages) {
        const lookupLocale = new Intl.Locale(language);
        for (const locale of availableLocales) {
            if (language === locale) {
                return locale;
            } else {
                const parsedLocale = new Intl.Locale(locale);
                if (parsedLocale.language === lookupLocale.language) {
                    if (parsedLocale.script === undefined || parsedLocale.script === lookupLocale.script) {
                        if (parsedLocale.region === undefined || parsedLocale.region === lookupLocale.region) {
                            return locale;
                        }
                    }
                }
            }
        }
    }

    return undefined;
}
