import {describe, expect, test} from "vitest";
import {matchMimeType} from "./matchMimeType";

describe('strict false', () => {
  test.each([
    {mime: 'application/json', check: 'application/json', match: true},
    {mime: '*/*', check: 'application/json', match: true},
    {mime: 'application/json', check: '*/*', match: true},
    {mime: '*/*', check: '*/*', match: true},
    {mime: '*/*', check: '*/*;foo=bar', match: true},
    {mime: '*/*;foo=bar', check: '*/*', match: true},
    {mime: 'application/json;foo=bar', check: '*/*;foo=bar', match: true},
    {mime: 'text/plain;format=flowed', check: '*/*;', match: true},
    {mime: '*/*;foo=bar', check: 'application/json;foo=bar', match: true},
    {mime: 'application/json', check: 'application/*', match: true},
    {mime: 'application/*', check: 'application/json', match: true},
    {mime: 'text/plain;format=flowed', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/*;format=flowed', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/plain;format=flowed', check: 'text/*;format=flowed', match: true},
    {mime: 'text/plain', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/plain;format=flowed', check: 'text/plain', match: true},
    {mime: 'text/*', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/plain;format=flowed', check: 'text/*', match: true},
    {mime: 'text/*;format=flowed', check: 'text/plain', match: true},
    {mime: 'text/plain', check: 'text/*;format=flowed', match: true},
    {mime: 'application/json', check: '*/*;foo=bar', match: true},
    {mime: '*/*;foo=bar', check: 'application/json', match: true},

    {mime: 'application/json', check: 'text/html', match: false},
    {mime: 'application/json;foo=bar', check: 'text/html;foo=bar', match: false},
    {mime: 'application/json', check: 'application/hal+json', match: false},
    {mime: 'application/json', check: 'application/xml', match: false},
    {mime: 'text/plain;format=flowed', check: 'text/plain;foo=bar', match: false},
    {mime: '*/*;foo=bar', check: '*/*;bar=foo', match: false},
    {mime: 'text/*;foo=bar', check: 'text/plain;bar=foo', match: false},
    {mime: 'text/plain;foo=bar', check: 'text/*;bar=foo', match: false},
  ])('mimeType: $mime; check: $check; match: $match', ({mime, check, match}) => {
    const result = matchMimeType(mime, check, false);
    expect(result).toBe(match);
  });
});

describe('strict true', () => {
  test.each([
    {mime: 'application/json', check: 'application/json', match: true},
    {mime: '*/*', check: 'application/json', match: true},
    {mime: '*/*', check: '*/*', match: true},
    {mime: '*/*', check: '*/*;foo=bar', match: true},
    {mime: '*/*;foo=bar', check: 'application/json;foo=bar', match: true},
    {mime: 'application/*', check: 'application/json', match: true},
    {mime: 'text/plain;format=flowed', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/*;format=flowed', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/plain', check: 'text/plain;format=flowed', match: true},
    {mime: 'text/*', check: 'text/plain;format=flowed', match: true},

    {mime: 'text/plain;format=flowed', check: '*/*;', match: false},
    {mime: 'application/json', check: '*/*', match: false},
    {mime: '*/*;foo=bar', check: '*/*', match: false},
    {mime: 'application/json;foo=bar', check: '*/*;foo=bar', match: false},
    {mime: 'application/json', check: 'application/*', match: false},
    {mime: 'text/plain;format=flowed', check: 'text/*;format=flowed', match: false},
    {mime: 'text/plain;format=flowed', check: 'text/plain', match: false},
    {mime: 'text/plain;format=flowed', check: 'text/*', match: false},
    {mime: 'text/*;format=flowed', check: 'text/plain', match: false},
    {mime: 'text/plain', check: 'text/*;format=flowed', match: false},

    {mime: 'application/json', check: 'text/html', match: false},
    {mime: 'application/json;foo=bar', check: 'text/html;foo=bar', match: false},
    {mime: 'application/json', check: 'application/hal+json', match: false},
    {mime: 'application/json', check: 'application/xml', match: false},
    {mime: 'text/plain;format=flowed', check: 'text/plain;foo=bar', match: false},
    {mime: 'application/json', check: '*/*;foo=bar', match: false},
    {mime: '*/*;foo=bar', check: 'application/json', match: false},
    {mime: '*/*;foo=bar', check: '*/*;bar=foo', match: false},
    {mime: 'text/*;foo=bar', check: 'text/plain;bar=foo', match: false},
    {mime: 'text/plain;foo=bar', check: 'text/*;bar=foo', match: false},
  ])('mimeType: $mime; check: $check; match: $match', ({mime, check, match}) => {
    const result = matchMimeType(mime, check);
    expect(result).toBe(match);
  });
});
