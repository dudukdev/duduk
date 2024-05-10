import {beforeEach, expect, test} from "vitest";
import {data} from "./data";
import {localeStrings} from "./export";

beforeEach(() => {
  data.strings = {};
  data.locales.clear();
  data.defaultLocale = undefined;
});

test('return nothing if locales empty', () => {
  const result = localeStrings('de-DE, en-US');
  expect(result).toEqual({strings: {}, locale: ''});
});

test('return nothing if defaultLocale not set', () => {
  data.strings = {
    de: {id1: 'deText', id2: 'deOther'}
  };
  data.locales.add('de');
  data.defaultLocale = undefined;

  const result = localeStrings('de-DE, en-US');
  expect(result).toEqual({strings: {}, locale: ''});
});

test('return strings from language if first accepted language', () => {
  data.strings = {
    de: {id1: 'deText', id2: 'deOther'},
    en: {id1: 'enText', id2: 'enOther'},
  };
  data.locales.add('de');
  data.locales.add('en');
  data.defaultLocale = 'en';

  const result = localeStrings('de-DE, en-US');
  expect(result).toEqual({strings: {id1: 'deText', id2: 'deOther'}, locale: 'de'});
});

test('return strings from language if not first accepted language', () => {
  data.strings = {
    de: {id1: 'deText', id2: 'deOther'},
    en: {id1: 'enText', id2: 'enOther'},
  };
  data.locales.add('de');
  data.locales.add('en');
  data.defaultLocale = 'en';

  const result = localeStrings('fr-FR, de-DE');
  expect(result).toEqual({strings: {id1: 'deText', id2: 'deOther'}, locale: 'de'});
});

test('return strings from default language accepted language not set', () => {
  data.strings = {
    de: {id1: 'deText', id2: 'deOther'},
    en: {id1: 'enText', id2: 'enOther'},
  };
  data.locales.add('de');
  data.locales.add('en');
  data.defaultLocale = 'en';

  const result = localeStrings('fr-FR');
  expect(result).toEqual({strings: {id1: 'enText', id2: 'enOther'}, locale: 'en'});
});

test('return strings from accepted language extended by default language', () => {
  data.strings = {
    de: {id1: 'deText', id2: 'deOther'},
    en: {id1: 'enText', id2: 'enOther', id3: 'enNext'},
  };
  data.locales.add('de');
  data.locales.add('en');
  data.defaultLocale = 'en';

  const result = localeStrings('de-DE');
  expect(result).toEqual({strings: {id1: 'deText', id2: 'deOther', id3: 'enNext'}, locale: 'de'});
});
