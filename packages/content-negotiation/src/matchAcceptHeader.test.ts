import {expect, test} from "vitest";
import {matchAcceptHeader} from "./matchAcceptHeader";

test.each([
  {header: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8', match: ['text/html', 'application/json'], expected: 'text/html'},
  {header: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8', match: ['application/json', 'text/html'], expected: 'text/html'},
  {header: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8', match: ['audio/mp3', 'audio/waf'], expected: 'audio/mp3'},
  {header: 'application/json', match: ['application/*', 'application/json'], expected: 'application/json'},
  {header: 'application/json', match: ['application/json', 'application/*'], expected: 'application/json'},
  {header: 'application/json, application/*', match: ['application/xml'], expected: 'application/xml'},
  {header: 'application/json, application/json', match: ['application/xml'], expected: undefined},
  {header: 'application/xml', match: ['application/xml', 'application/xml'], expected: 'application/xml'},
  {header: 'text/*, text/plain, text/plain;format=flowed, */*', match: ['text/*', 'text/plain', 'text/plain;format=flowed', '*/*'], expected: 'text/plain;format=flowed'},
  {header: 'text/*, text/plain;format=flowed, text/plain, */*', match: ['text/*', 'text/plain', 'text/plain;format=flowed', '*/*'], expected: 'text/plain;format=flowed'},
  {header: 'text/*, text/plain, text/plain;format=flowed, */*', match: ['text/*', 'text/html;format=flowed', 'text/plain;format=flowed', '*/*'], expected: 'text/plain;format=flowed'},
  {header: '*/*, text/*, text/plain, text/plain;format=flowed', match: ['text/*', 'text/html;format=flowed', 'text/plain;format=flowed', '*/*'], expected: 'text/plain;format=flowed'},
  {header: 'text/plain;format=flowed', match: ['text/*', 'text/plain;format=flowed', 'text/plain', '*/*'], expected: 'text/plain;format=flowed'},
  {header: 'text/*', match: ['text/*', 'text/plain;format=flowed', 'text/plain;foo=bar', '*/*'], expected: 'text/plain;format=flowed'},
  {header: 'text/*', match: ['*/*', 'text/*', 'text/plain;format=flowed', 'text/plain;foo=bar'], expected: 'text/plain;format=flowed'},
])('header: $header; match: $match; expected: $expected', ({header, match, expected}) => {
  const result = matchAcceptHeader(header, match);
  expect(result).toEqual(expected);
});
