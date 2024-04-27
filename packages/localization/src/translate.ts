import {applyPlaceholder} from "./placeholder";
import {localeStrings} from "../index";
import {defaultLanguages} from "./defaultLanguage";

export function t(id: string, options?: {plural?: number | Record<string, number>, locale?: string | string[] | readonly string[]}): string {
  options ??= {};
  return translate(id, {locale: defaultLanguages(), ...options}) ?? id;
}

export function translate(id: string, options: {plural?: number | Record<string, number>, locale: string | string [] | readonly string[]}): string | undefined {
  const compiledLocaleStrings = localeStrings(options.locale);
  if (id in compiledLocaleStrings) {
    const stringValue = compiledLocaleStrings[id];
    if (typeof stringValue === 'string') {
      return stringValue;
    } else {
      const pluralSet = new Map<string, string>();
      const keyNames = new Set<string>();
      for (const key of Object.keys(stringValue)) {
        let setKey: Record<string, string> = {};
        const parts = key.split(' ');
        for (const part of parts) {
          const [varName, count] = part.split(':');
          keyNames.add(varName);
          setKey[varName] = count;
        }
        setKey = Object.keys(setKey).sort().reduce((acc, key) => {acc[key] = setKey[key]; return acc}, {});
        pluralSet.set(JSON.stringify(setKey), stringValue[key]);
      }

      const rules = new Intl.PluralRules();
      const format = new Intl.NumberFormat();
      options.plural ??= 0;

      let setKey: Record<string, string> = {};
      let pluralValues: Record<string, string> = {};
      if (typeof options.plural === 'number') {
        const plural = rules.select(options.plural);
        for (const keyName of keyNames) {
          setKey[keyName] = plural;
          pluralValues[keyName] = format.format(options.plural);
        }
      } else {
        for (const keyName of keyNames) {
          setKey[keyName] = rules.select(options.plural[keyName] ?? 0);
          pluralValues[keyName] = format.format(options.plural[keyName] ?? 0);
        }
      }
      setKey = Object.keys(setKey).sort().reduce((acc, key) => {acc[key] = setKey[key]; return acc}, {});

      const pluralizedString = pluralSet.get(JSON.stringify(setKey));
      return applyPlaceholder(pluralizedString, pluralValues);
    }
  }
  return undefined;
}
