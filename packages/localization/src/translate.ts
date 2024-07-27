import {applyPlaceholder} from "./placeholder";
import {localeStrings} from "./export";
import {defaultLanguages} from "./defaultLanguage";
import type {AcceptLocale} from "./data";

type Plural = number | Record<string, number>;
type Variables = Record<string, string | number>;

export function t(id: string, options?: {plural?: Plural, variables?: Variables, locale?: AcceptLocale, routeId?: string}): string {
  options ??= {};
  return translate(id, {locale: defaultLanguages(), ...options}) ?? id;
}

export function translate(id: string, options: {plural?: Plural, variables?: Variables, locale: AcceptLocale, routeId?: string}): string | undefined {
  const routeId = options.routeId ?? (typeof window !== 'undefined' ? window.__duduk?.routeId : undefined);
  if (id.startsWith('$route.') && routeId !== undefined) {
    id = `@routes.${routeId}.${id.substring(7)}`;
  }

  const {strings, locale} = localeStrings(options.locale);
  if (id in strings) {
    const stringValue = strings[id];
    if (typeof stringValue === 'string') {
      return applyVariables(stringValue, locale, options.variables);
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
        setKey = Object.keys(setKey).sort().reduce((acc: Record<string, string>, key) => {acc[key] = setKey[key]; return acc}, {});
        pluralSet.set(JSON.stringify(setKey), stringValue[key]);
      }

      const rules = new Intl.PluralRules();
      const format = new Intl.NumberFormat(locale);
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
      setKey = Object.keys(setKey).sort().reduce((acc: Record<string, string>, key) => {acc[key] = setKey[key]; return acc}, {});

      const pluralizedString = pluralSet.get(JSON.stringify(setKey)) ?? undefined;
      if (pluralizedString === undefined) {
        return undefined;
      }
      const appliedString = applyPlaceholder(pluralizedString, pluralValues);

      return applyVariables(appliedString, locale, options.variables);
    }
  }
  return undefined;
}

function applyVariables(templateString: string, locale: string, variables?: Variables): string {
  if (variables !== undefined) {
    const stringVariables: Record<string, string> = {};
    for (const [key, value] of Object.entries(variables)) {
      if (typeof value === 'number') {
        const formatter = new Intl.NumberFormat(locale);
        stringVariables[key] = formatter.format(value);
      } else {
        stringVariables[key] = value;
      }
    }
    return applyPlaceholder(templateString, stringVariables);
  }
  return templateString;
}
