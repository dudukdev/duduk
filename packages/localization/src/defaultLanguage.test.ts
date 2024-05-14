import {afterEach, expect, test, vi} from "vitest";
import {defaultLanguages} from "./defaultLanguage";

afterEach(() => {
  vi.unstubAllGlobals;
});

test('return navigator.languages if defined', () => {
  vi.stubGlobal('navigator', {languages: ['de-DE', 'en-US']});
  expect(defaultLanguages()).toEqual(['de-DE', 'en-US']);
});

test('return empty array if navigator defined but languages not defined', () => {
  vi.stubGlobal('navigator', {languages: undefined});
  expect(defaultLanguages()).toEqual([]);
});

test('return empty array if navigator not defined', () => {
  vi.stubGlobal('navigator', undefined);
  expect(defaultLanguages()).toEqual([]);
});
