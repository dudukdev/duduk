import {beforeEach, describe, expect, test, vi} from "vitest";
import {data} from "./data";
import {t, translate} from "./translate";
import {defaultLanguages} from "./defaultLanguage";

vi.mock('./defaultLanguage', () => ({defaultLanguages: vi.fn()}));

beforeEach(() => {
  data.strings = {
    en: {
      simple: 'This is a text',
      withVar: 'This is a {val} text',
      plural: {
        'count:one': '{count} apple',
        'count:other': '{count} apples'
      },
      pluralWithVar: {
        'count:one': '{count} {val} apple',
        'count:other': '{count} {val} apples'
      },
      pluralDouble: {
        'cOne:one cTwo:one': '{cOne} apple and {cTwo} horse',
        'cOne:other cTwo:one': '{cOne} apples and {cTwo} horse',
        'cOne:one cTwo:other': '{cOne} apple and {cTwo} horses',
        'cOne:other cTwo:other': '{cOne} apples and {cTwo} horses'
      },
      pluralIncomplete: {
        'count:one': '{count} apple',
      },
      onlyEng: 'Another text'
    },
    de: {
      simple: 'Das ist ein Text',
      withVar: 'Das ist ein {val} Text',
    }
  };
  data.locales.clear();
  data.locales.add('en')
  data.locales.add('de')
  data.defaultLocale = 'en';
});

describe('t()', () => {
  test('return string from id with defaultLanguage', () => {
    vi.mocked(defaultLanguages).mockReturnValue(['de-DE', 'en-US']);
    const result = t('simple');
    expect(result).toEqual('Das ist ein Text');
  });

  test('return id if not exists', () => {
    const result = t('nonExistingId');
    expect(result).toEqual('nonExistingId');
  });
});

describe('translate()', () => {
  test('return undefined if not exists', () => {
    const result = translate('nonExistingId', {locale: 'en'});
    expect(result).toEqual(undefined);
  });

  test('return string from id', () => {
    const resultEn = translate('simple', {locale: 'en-US; de-DE'});
    const resultDe = translate('simple', {locale: 'de-DE; en-US'});
    expect(resultEn).toEqual('This is a text');
    expect(resultDe).toEqual('Das ist ein Text');
  });

  test('return defaultLocale fallback', () => {
    const result = translate('onlyEng', {locale: 'de-DE'});
    expect(result).toEqual('Another text');
  });

  test('apply string variable', () => {
    const result = translate('withVar', {locale: 'en', variables: {val: 'nice'}});
    expect(result).toEqual('This is a nice text');
  });

  test('apply number variable', () => {
    const resultEn = translate('withVar', {locale: 'en', variables: {val: 12345.678}});
    const resultDe = translate('withVar', {locale: 'de', variables: {val: 12345.678}});
    expect(resultEn).toEqual('This is a 12,345.678 text');
    expect(resultDe).toEqual('Das ist ein 12.345,678 Text');
  });

  describe('plural', () => {
    test('get pluralized string with object', () => {
      const result0 = translate('plural', {locale: 'en', plural: {count: 0}});
      const result1 = translate('plural', {locale: 'en', plural: {count: 1}});
      const result2 = translate('plural', {locale: 'en', plural: {count: 2}});
      const result10 = translate('plural', {locale: 'en', plural: {count: 10}});
      expect(result0).toEqual('0 apples');
      expect(result1).toEqual('1 apple');
      expect(result2).toEqual('2 apples');
      expect(result10).toEqual('10 apples');
    });

    test('get pluralized string with empty object', () => {
      const result = translate('plural', {locale: 'en', plural: {}});
      expect(result).toEqual('0 apples');
    });

    test('return undefined if plural rule not exists', () => {
      const result = translate('pluralIncomplete', {locale: 'en', plural: {count: 2}});
      expect(result).toEqual(undefined);
    });

    test('get pluralized string with number', () => {
      const result0 = translate('plural', {locale: 'en', plural: 0});
      const result1 = translate('plural', {locale: 'en', plural: 1});
      const result2 = translate('plural', {locale: 'en', plural: 2});
      const result10 = translate('plural', {locale: 'en', plural: 10});
      expect(result0).toEqual('0 apples');
      expect(result1).toEqual('1 apple');
      expect(result2).toEqual('2 apples');
      expect(result10).toEqual('10 apples');
    });

    test('get pluralized string with variables', () => {
      const result0 = translate('pluralWithVar', {locale: 'en', plural: {count: 0}, variables: {val: 'nice'}});
      const result1 = translate('pluralWithVar', {locale: 'en', plural: {count: 1}, variables: {val: 'nice'}});
      const result2 = translate('pluralWithVar', {locale: 'en', plural: {count: 2}, variables: {val: 'nice'}});
      const result10 = translate('pluralWithVar', {locale: 'en', plural: {count: 10}, variables: {val: 'nice'}});
      expect(result0).toEqual('0 nice apples');
      expect(result1).toEqual('1 nice apple');
      expect(result2).toEqual('2 nice apples');
      expect(result10).toEqual('10 nice apples');
    });

    test('get double pluralized string with object', () => {
      const result0_0 = translate('pluralDouble', {locale: 'en', plural: {cOne: 0, cTwo: 0}});
      const result1_0 = translate('pluralDouble', {locale: 'en', plural: {cOne: 1, cTwo: 0}});
      const result2_0 = translate('pluralDouble', {locale: 'en', plural: {cOne: 2, cTwo: 0}});
      const result0_1 = translate('pluralDouble', {locale: 'en', plural: {cOne: 0, cTwo: 1}});
      const result1_1 = translate('pluralDouble', {locale: 'en', plural: {cOne: 1, cTwo: 1}});
      const result2_1 = translate('pluralDouble', {locale: 'en', plural: {cOne: 2, cTwo: 1}});
      const result0_2 = translate('pluralDouble', {locale: 'en', plural: {cOne: 0, cTwo: 2}});
      const result1_2 = translate('pluralDouble', {locale: 'en', plural: {cOne: 1, cTwo: 2}});
      const result2_2 = translate('pluralDouble', {locale: 'en', plural: {cOne: 2, cTwo: 2}});
      expect(result0_0).toEqual('0 apples and 0 horses');
      expect(result1_0).toEqual('1 apple and 0 horses');
      expect(result2_0).toEqual('2 apples and 0 horses');
      expect(result0_1).toEqual('0 apples and 1 horse');
      expect(result1_1).toEqual('1 apple and 1 horse');
      expect(result2_1).toEqual('2 apples and 1 horse');
      expect(result0_2).toEqual('0 apples and 2 horses');
      expect(result1_2).toEqual('1 apple and 2 horses');
      expect(result2_2).toEqual('2 apples and 2 horses');
    });

    test('get double pluralized string with number', () => {
      const result0 = translate('pluralDouble', {locale: 'en', plural: 0});
      const result1 = translate('pluralDouble', {locale: 'en', plural: 1});
      const result2 = translate('pluralDouble', {locale: 'en', plural: 2});
      expect(result0).toEqual('0 apples and 0 horses');
      expect(result1).toEqual('1 apple and 1 horse');
      expect(result2).toEqual('2 apples and 2 horses');
    });
  });
});
