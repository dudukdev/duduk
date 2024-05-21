import {afterEach, describe, expect, test, vi} from "vitest";
import fsPromise from "node:fs/promises";

vi.mock('node:fs/promises', () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn()
  }
}));
vi.mock(`${import.meta.dirname}/__app/_.._/inject/locales-nhd73.js`, () => ({
  getLocaleStrings: () => {}
}));

afterEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

describe('rootCss', () => {
  test('return rootCss content', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'root-nhd73.css', 'someFolder']);
    vi.mocked(fsPromise.readFile).mockResolvedValue('some root css file content');

    const {rootCss} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app`);
    expect(fsPromise.readFile).toHaveBeenCalledWith(`${import.meta.dirname}/__app/root-nhd73.css`, {encoding: 'utf8'});
    expect(rootCss).toEqual('some root css file content');
  });

  test('return undefined if not rootCss file', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'someFolder']);
    vi.mocked(fsPromise.readFile).mockResolvedValue('some root css file content');

    const {rootCss} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app`);
    expect(fsPromise.readFile).not.toHaveBeenCalled();
    expect(rootCss).toBeUndefined();
  });
});

describe('appCss', () => {
  test('return appCss path', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'app-nhd73.css', 'someFolder']);

    const {appCss} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app`);
    expect(appCss).toEqual('/__app/app-nhd73.css');
  });

  test('return undefined if not appCss file', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'someFolder']);

    const {appCss} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app`);
    expect(appCss).toBeUndefined();
  });
});

describe('setupClient', () => {
  test('return setupClient path', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'setupClient-nhd73.js', 'someFolder']);

    const {setupClient} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app`);
    expect(setupClient).toEqual('/__app/setupClient-nhd73.js');
  });

  test('return undefined if not setupClient file', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'someFolder']);

    const {setupClient} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app`);
    expect(setupClient).toBeUndefined();
  });
});

describe('getLocaleStrings', () => {
  test('return getLocaleStrings function', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'locales-nhd73.js', 'someFolder']);

    const {getLocaleStrings} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app/_.._/inject`);
    expect(getLocaleStrings).toEqual((await import(`${import.meta.dirname}/__app/_.._/inject/locales-nhd73.js`)).getLocaleStrings);
  });

  test('return undefined if not setupClient file', async () => {
    // @ts-ignore
    vi.mocked(fsPromise.readdir).mockResolvedValue(['otherFile.js', 'someFolder']);

    const {getLocaleStrings} = await import('./rootFiles');

    expect(fsPromise.readdir).toHaveBeenCalledWith(`${import.meta.dirname}/__app/_.._/inject`);
    expect(getLocaleStrings).toBeUndefined();
  });
});
