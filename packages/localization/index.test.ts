import {expect, test} from "vitest";

test('export correct values', async () => {
  const module = await import('./index');
  expect(Object.keys(module)).toEqual([
    'loadLocale',
    'loadLocaleClient',
    'injectI18n',
    't',
    'localeStrings'
  ]);
});
