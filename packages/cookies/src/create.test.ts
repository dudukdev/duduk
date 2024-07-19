import {describe, expect, test} from "vitest";
import {type Cookie, createSetCookieHeader} from "./create";

test('create cookie with only key and value', () => {
  const cookie: Cookie = {
    key: 'My-2_Cookie.',
    value: 'aCookieValue',
    httpOnly: false,
    partitioned: false,
    secure: false
  };
  const result = createSetCookieHeader(cookie);
  expect(result).toEqual('My-2_Cookie.=aCookieValue');
});

test('create cookie with all properties', () => {
  const cookie: Cookie = {
    key: 'MyCookie',
    value: 'aCookieValue',
    domain: 'mydomain.com',
    expires: new Date('2024-07-18T21:22:07.512Z'),
    httpOnly: true,
    maxAge: 1234,
    partitioned: true,
    path: '/page',
    priority: 'Medium',
    secure: true,
    sameSite: 'Lax'
  };
  const result = createSetCookieHeader(cookie);
  expect(result).toEqual('MyCookie=aCookieValue; Domain=mydomain.com; Expires=Thu, 18 Jul 2024 21:22:07 GMT; HttpOnly; Max-Age=1234; Partitioned; Path=/page; SameSite=Lax; Secure');
});

describe('throw if invalid key', () => {
  test('empty key', () => {
    const cookie: Cookie = {
      key: '',
      value: 'aCookieValue'
    };
    expect(() => createSetCookieHeader(cookie)).toThrowError('Cookie key contains invalid characters');
  });

  test.each([';', ',', ' ', 'ß', 'ö', 'é'])('not allowed character "%s"', (character) => {
    const cookie: Cookie = {
      key: `My${character}Cookie`,
      value: 'aCookieValue'
    };
    expect(() => createSetCookieHeader(cookie)).toThrowError('Cookie key contains invalid characters');
  });
});

describe('throw if invalid value', () => {
  test('empty value', () => {
    const cookie: Cookie = {
      key: 'MyCookie',
      value: ''
    };
    expect(() => createSetCookieHeader(cookie)).toThrowError('Cookie value contains invalid characters');
  });

  test.each([';', ',', ' '])('not allowed character "%s"', (character) => {
    const cookie: Cookie = {
      key: 'MyCookie',
      value: `aCookie${character}Value`
    };
    expect(() => createSetCookieHeader(cookie)).toThrowError('Cookie value contains invalid characters');
  });
});
