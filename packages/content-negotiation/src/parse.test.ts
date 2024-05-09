import {expect, test} from "vitest";
import {parseHeader} from "./parse";

test('return parsed header', () => {
  const header = 'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp;foo=bar, */*;q=0.8, text/plain;format=fixed;q=0.4, text/plain;format=fixed;foo=bar;q=0.4';
  const result = parseHeader(header);
  expect(result).toEqual([
    {parameters: {}, value: 'text/html', weight: 1, raw: 'text/html'},
    {parameters: {}, value: 'application/xhtml+xml', weight: 1, raw: 'application/xhtml+xml'},
    {parameters: {foo: 'bar'}, value: 'image/webp', weight: 1, raw: 'image/webp;foo=bar'},
    {parameters: {}, value: 'application/xml', weight: 0.9, raw: 'application/xml'},
    {parameters: {}, value: '*/*', weight: 0.8, raw: '*/*'},
    {parameters: {format: 'fixed'}, value: 'text/plain', weight: 0.4, raw: 'text/plain;format=fixed'},
    {parameters: {format: 'fixed', foo: 'bar'}, value: 'text/plain', weight: 0.4, raw: 'text/plain;format=fixed;foo=bar'}
  ]);
});
