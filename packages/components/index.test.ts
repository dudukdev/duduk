import {expect, test} from "vitest";

test('export correct values', async () => {
  const module = await import('./index');
  expect(Object.keys(module)).toEqual([
    'css',
    'html',
    'WebComponent'
  ]);
});
