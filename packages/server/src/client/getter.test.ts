import {afterEach, describe, expect, test, vi} from "vitest";
import {getData, getParams} from "./getter";

afterEach(() => {
  vi.unstubAllGlobals;
});

describe('getData()', () => {
  test('return pageData', () => {
    vi.stubGlobal('window', {__duduk: {pageData: {foo: 'bar'}}});
    const result = getData();
    expect(result).toEqual({foo: 'bar'});
  });

  test('return empty object if pageData is undefined', () => {
    vi.stubGlobal('window', {__duduk: {pageData: undefined}});
    const result = getData();
    expect(result).toEqual({});
  });

  test('return empty object if __duduk is undefined', () => {
    vi.stubGlobal('window', {__duduk: undefined});
    const result = getData();
    expect(result).toEqual({});
  });
});

describe('getParams()', () => {
  test('return pageParams', () => {
    vi.stubGlobal('window', {__duduk: {pageParams: {foo: 'bar'}}});
    const result = getParams();
    expect(result).toEqual({foo: 'bar'});
  });

  test('return empty object if pageParams is undefined', () => {
    vi.stubGlobal('window', {__duduk: {pageParams: undefined}});
    const result = getParams();
    expect(result).toEqual({});
  });

  test('return empty object if __duduk is undefined', () => {
    vi.stubGlobal('window', {__duduk: undefined});
    const result = getParams();
    expect(result).toEqual({});
  });
});
