import {expect, test} from "vitest";
import {applyPlaceholder} from "./placeholder";

test.each<{template: string, values: Record<string, string>, expected: string}>([
  {template: 'This is a string', values: {}, expected: 'This is a string'},
  {template: 'This is a string', values: {foo: 'bar'}, expected: 'This is a string'},
  {template: 'This is a {val} string', values: {val: 'nice'}, expected: 'This is a nice string'},
  {template: 'This is a {val} string', values: {}, expected: 'This is a {val} string'},
  {template: 'This is a {val} string', values: {foo: 'bar'}, expected: 'This is a {val} string'},
  {template: 'This is a {val} {other}', values: {val: 'nice', other: 'string'}, expected: 'This is a nice string'},
  {template: 'This is a {val} {other}', values: {other: 'string', val: 'nice'}, expected: 'This is a nice string'},
])('template: $template; values: $values; expected: $expected', ({template, values, expected}) => {
  const result = applyPlaceholder(template, values);
  expect(result).toEqual(expected);
});

