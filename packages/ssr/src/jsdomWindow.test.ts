import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {JSDOM} from "jsdom";
import {setupJSDOMWindow} from "./jsdomWindow";

beforeEach(() => {
  vi.stubGlobal('console', {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('log error on navigation if not mocked', () => {
  const jsdom = new JSDOM(undefined, {url: 'https://localhost/'});

  // @ts-ignore
  jsdom.window.location = 'https://domain.com/';
  expect(console.error).toHaveBeenCalledOnce();
  expect((vi.mocked(console.error).mock.lastCall![0] as string).startsWith('Error: Not implemented: navigation (except hash changes)')).toBeTruthy();
  vi.mocked(console.error).mockReset();

  jsdom.window.location.href = 'https://domain.com/';
  expect(console.error).toHaveBeenCalledOnce();
  expect((vi.mocked(console.error).mock.lastCall![0] as string).startsWith('Error: Not implemented: navigation (except hash changes)')).toBeTruthy();
  vi.mocked(console.error).mockReset();

  jsdom.window.location.assign('https://domain.com/');
  expect(console.error).toHaveBeenCalledOnce();
  expect((vi.mocked(console.error).mock.lastCall![0] as string).startsWith('Error: Not implemented: navigation (except hash changes)')).toBeTruthy();
  vi.mocked(console.error).mockReset();

  jsdom.window.location.replace('https://domain.com/');
  expect(console.error).toHaveBeenCalledOnce();
  expect((vi.mocked(console.error).mock.lastCall![0] as string).startsWith('Error: Not implemented: navigation (except hash changes)')).toBeTruthy();
  vi.mocked(console.error).mockReset();

  jsdom.window.location.reload();
  expect(console.error).toHaveBeenCalledOnce();
  expect((vi.mocked(console.error).mock.lastCall![0] as string).startsWith('Error: Not implemented: navigation (except hash changes)')).toBeTruthy();
  vi.mocked(console.error).mockReset();
});

test('do not log error and not set href on navigation if mocked', () => {
  const jsdom = new JSDOM(undefined, {url: 'https://localhost/'});
  setupJSDOMWindow(jsdom);

  // @ts-ignore
  jsdom.window.location = 'https://domain.com/';
  expect(console.error).not.toHaveBeenCalled();
  expect(jsdom.window.location.href).toEqual('https://localhost/');
  vi.mocked(console.error).mockReset();

  jsdom.window.location.href = 'https://domain.com/';
  expect(console.error).not.toHaveBeenCalled();
  expect(jsdom.window.location.href).toEqual('https://localhost/');
  vi.mocked(console.error).mockReset();

  jsdom.window.location.assign('https://domain.com/');
  expect(console.error).not.toHaveBeenCalled();
  expect(jsdom.window.location.href).toEqual('https://localhost/');
  vi.mocked(console.error).mockReset();

  jsdom.window.location.replace('https://domain.com/');
  expect(console.error).not.toHaveBeenCalled();
  expect(jsdom.window.location.href).toEqual('https://localhost/');
  vi.mocked(console.error).mockReset();

  jsdom.window.location.reload();
  expect(console.error).not.toHaveBeenCalled();
  vi.mocked(console.error).mockReset();
});

test('set other properties even if mocked', () => {
  const jsdom = new JSDOM(undefined, {url: 'https://localhost/'});
  setupJSDOMWindow(jsdom);

  jsdom.window.name = 'someName';

  expect(jsdom.window.name).toEqual('someName');
});
