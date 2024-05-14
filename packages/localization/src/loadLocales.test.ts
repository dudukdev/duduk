import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {data} from "./data";
import {loadLocale, loadLocaleClient} from "./loadLocales";

beforeEach(() => {
  data.strings = {};
  data.locales.clear();
  data.defaultLocale = undefined;
  vi.stubGlobal('window', {
    __app: undefined
  })
});

afterEach(() => {
  vi.unstubAllGlobals;
});

describe('loadLocaleClient()', () => {
  test('set locales from __app', () => {
    window.__app = {locales: {id1: 'text', id2: 'other'}};

    loadLocaleClient();

    expect(data.strings).toEqual({compiled: {id1: 'text', id2: 'other'}});
    expect([...data.locales.values()]).toEqual(['compiled']);
    expect(data.defaultLocale).toEqual('compiled');
  });

  test('replace pre-existing locales', () => {
    window.__app = {locales: {id1: 'text', id2: 'other'}};
    data.strings = {de: {foo: 'bar'}};
    data.locales.add('de');
    data.defaultLocale = 'de';

    loadLocaleClient();

    expect(data.strings).toEqual({compiled: {id1: 'text', id2: 'other'}});
    expect([...data.locales.values()]).toEqual(['compiled']);
    expect(data.defaultLocale).toEqual('compiled');
  });

  test('do not change pre-existing locales if __app.locales undefined', () => {
    window.__app = {locales: undefined};
    data.strings = {de: {foo: 'bar'}};
    data.locales.add('de');
    data.defaultLocale = 'de';

    loadLocaleClient();

    expect(data.strings).toEqual({de: {foo: 'bar'}});
    expect([...data.locales.values()]).toEqual(['de']);
    expect(data.defaultLocale).toEqual('de');
  });

  test('do not change pre-existing locales if __app undefined', () => {
    window.__app = undefined;
    data.strings = {de: {foo: 'bar'}};
    data.locales.add('de');
    data.defaultLocale = 'de';

    loadLocaleClient();

    expect(data.strings).toEqual({de: {foo: 'bar'}});
    expect([...data.locales.values()]).toEqual(['de']);
    expect(data.defaultLocale).toEqual('de');
  });
});

describe('loadLocale()', () => {
  test('add locale with plurals and set defaultLocale if no locale set yet', () => {
    const localeStrings = {
      foo: 'bar',
      sub: {
        some: 'thing',
        'other.thing': 'there',
        other: {
          one: 'here',
          'text.horse::plural': {
            'count:one': '{count} horse',
            'count:other': '{count} horses'
          }
        }
      },
      'hello.world': 'you!',
      'text::plural': {
        'count:one': '{count} apple',
        'count:other': '{count} apples'
      }
    };

    loadLocale('en', localeStrings);

    expect(data.strings).toEqual({en: {
        foo: 'bar',
        'sub.some': 'thing',
        'sub.other.thing': 'there',
        'sub.other.one': 'here',
        'sub.other.text.horse': {
          'count:one': '{count} horse',
          'count:other': '{count} horses'
        },
        'hello.world': 'you!',
        text: {
          'count:one': '{count} apple',
          'count:other': '{count} apples'
        }
    }});
    expect([...data.locales.values()]).toEqual(['en']);
    expect(data.defaultLocale).toEqual('en');
  });

  test('do not replace defaultLocale if already set', () => {
    data.strings = {de: {foo: 'bar'}};
    data.locales.add('de');
    data.defaultLocale = 'de';

    loadLocale('en', {foo: 'there'});

    expect(data.strings).toEqual({
      en: {foo: 'there'},
      de: {foo: 'bar'}
    });
    expect([...data.locales.values()]).toEqual(['de', 'en']);
    expect(data.defaultLocale).toEqual('de');
  });

  test('extend locale if already present', () => {
    data.strings = {de: {foo: 'bar'}};
    data.locales.add('de');
    data.defaultLocale = 'de';

    loadLocale('de', {some: 'thing'});

    expect(data.strings).toEqual({de: {foo: 'bar', some: 'thing'}});
    expect([...data.locales.values()]).toEqual(['de']);
    expect(data.defaultLocale).toEqual('de');
  });
});
