import {expect, test, vi} from "vitest";
import {localeStrings} from "@duduk/localization";
import {getLocaleStrings} from "./locales";

vi.mock('@duduk/localization', () => ({localeStrings: vi.fn()}));

test('get locale strings', () => {
  vi.mocked(localeStrings).mockReturnValue({strings: {foo: 'bar'}, locale: 'en'});

  const result = getLocaleStrings('en-US');

  expect(localeStrings).toHaveBeenCalledOnce();
  expect(localeStrings).toHaveBeenCalledWith('en-US');
  expect(result).toEqual({foo: 'bar'});
});
