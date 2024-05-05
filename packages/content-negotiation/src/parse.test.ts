import {expect, test} from "vitest";
import {parseHeader} from "./parse";

test('return parsed header', () => {
  const header = 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp;foo=bar, */*;q=0.8';
  const result = parseHeader(header);
  expect(result).toEqual([
    {parameters: {}, value: 'text/html', weight: 1},
    {parameters: {}, value: 'application/xhtml+xml', weight: 1},
    {parameters: {foo: 'bar'}, value: 'image/webp', weight: 1},
    {parameters: {}, value: 'application/xml', weight: 0.9},
    {parameters: {}, value: '*/*', weight: 0.8},
  ]);
});
