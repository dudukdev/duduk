import {expect, test} from "vitest";
import {html} from "./html";

test('return correct html', () => {
  const template = html`
    <h1>Hello, World!</h1>
    <p>Hello you!</p>
  `;

  expect(template.children).toHaveLength(2);
  expect(template.children[0].outerHTML).toEqual('<h1>Hello, World!</h1>');
  expect(template.children[1].outerHTML).toEqual('<p>Hello you!</p>');
});

test('return correct html if it contains variables', () => {
  const name = 'John';
  const template = html`
    <h1>Hello, World!</h1>
    <p>Hello ${name}!</p>
  `;

  expect(template.children).toHaveLength(2);
  expect(template.children[0].outerHTML).toEqual('<h1>Hello, World!</h1>');
  expect(template.children[1].outerHTML).toEqual('<p>Hello John!</p>');
});
