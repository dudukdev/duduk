import {expect, test} from "vitest";
import {matchLanguage} from "./matchLanguage";

test.each([
  {languages: 'de-DE, en-US', available: ['en', 'de'], expected: 'de'},
  {languages: 'de-DE;q=0.9, en-US', available: ['en', 'de'], expected: 'en'},
  {languages: ['de-DE', 'en-US'], available: ['en', 'de'], expected: 'de'},
  {languages: ['en-US', 'de-DE'], available: ['en', 'de'], expected: 'en'},
  {languages: ['en-US', 'de-DE'], available: ['fr', 'es'], expected: undefined},
  {languages: ['en', 'de'], available: ['de-DE', 'en-US'], expected: undefined},
  {languages: ['en', 'de'], available: ['de-DE', 'en-US', 'de'], expected: 'de'},
  {languages: ['en', 'de-DE', 'de'], available: ['de-DE', 'en-US', 'de'], expected: 'de-DE'},
  {languages: ['en-Latn-US', 'de-Latn-DE'], available: ['de', 'en'], expected: 'en'},
  {languages: ['en-Latn-US', 'de-Latn-DE'], available: ['de-DE', 'en-US'], expected: 'en-US'},
  {languages: ['en-Latn-US', 'de-Latn-DE'], available: ['de-DE', 'en-US'], expected: 'en-US'},
  {languages: ['sr-RS'], available: ['sr-Latn-RS', 'sr-Cyrl-RS'], expected: undefined},
  {languages: ['sr-Cyrl-RS'], available: ['sr-Latn-RS', 'sr-Cyrl-RS'], expected: 'sr-Cyrl-RS'},
  {languages: ['sr-RS', 'en-US'], available: ['sr-Latn', 'en'], expected: 'en'},
  {languages: ['sr-Latn-RS', 'sr-RS', 'en-US'], available: ['sr-Latn', 'en'], expected: 'sr-Latn'},
])('languages: $languages; available: $available; expected: $expected', ({languages, available, expected}) => {
  const result = matchLanguage(languages, available);
  expect(result).toEqual(expected);
});
