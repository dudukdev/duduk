import {expect, test} from "vitest";
import {matchMimeType} from "./matchMimeType";

test.each([
  {mime: 'application/json', check: 'application/json', match: true},
  {mime: '*/*', check: 'application/json', match: true},
  {mime: 'application/json', check: '*/*', match: true},
  {mime: '*/*', check: '*/*', match: true},
  {mime: 'application/json', check: 'application/*', match: true},
  {mime: 'application/*', check: 'application/json', match: true},

  {mime: 'application/json', check: 'text/html', match: false},
  {mime: 'application/json', check: 'application/hal+json', match: false},
  {mime: 'application/json', check: 'application/xml', match: false}
])('mimeType: $mime; check: $check; match: $match', ({mime, check, match}) => {
  const result = matchMimeType(mime, check);
  expect(result).toBe(match);
});
