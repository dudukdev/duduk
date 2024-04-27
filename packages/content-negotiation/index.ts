export function matchLanguage(languages: string | string[] | readonly string[], availableLocales: string[]): string | undefined {
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

export function matchAcceptHeader(acceptHeader: string, toCheck: string[]): string | undefined {
  const entries = parseHeader(acceptHeader);
  entries.sort((a, b) => {
    if (a.weight === b.weight) {
      const [aMime, aParameter] = a.value.split(';').map(v => v.trim());
      const [bMime, bParameter] = b.value.split(';').map(v => v.trim());

      if (aMime === bMime) {
        return aParameter === bParameter ? 0 : aParameter === undefined ? 1 : -1;
      }

      const [aType, aSubType] = aMime.split('/');
      const [bType, bSubType] = bMime.split('/');
    } else {
      return a.weight > b.weight ? -1 : 1;
    }
  });

  for (const check of toCheck) {
    for (const entry of entries) {
      if (matchMimeType(entry.value, check)) {
        return check;
      }
    }
  }

  return undefined;
}

export function matchMimeType(mimeType: string, challenge: string): boolean {
  const mime = mimeType.split(';', 1)[0].trim();

  if (mime === '*/*' || challenge === '*/*') {
    return true;
  }

  const [type, subtype] = mime.split('/');
  const [challengeType, challengeSubtype] = challenge.split('/');

  if (type !== challengeType) {
    return false;
  }

  return subtype === '*' || challengeSubtype === '*' || subtype === challengeSubtype;
}

export function parseHeader(header: string): {value: string, parameters: Record<string, string>; weight: number}[] {
  const parts = header.split(',').map(p => p.trim()).filter(p => p !== '');
  const result: {value: string, parameters: Record<string, string>; weight: number}[] = [];

  for (const part of parts) {
    const elements = part.split(';').map(e => e.trim());
    const value = elements.shift();
    let weight = 1;
    const parameters: Record<string, string> = {};
    for (const element of elements) {
      const [key, value] = element.split('=').map(e => e.trim());
      if (key === 'q') {
        weight = Number(value);
      } else {
        parameters[key] = value;
      }
    }
    result.push({value, parameters, weight});
  }

  return result.sort((a, b) => a.weight === b.weight ? 0 : a.weight > b.weight ? -1 : 1);
}
