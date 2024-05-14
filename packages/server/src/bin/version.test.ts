import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import path from "node:path";
import fsPromise from "node:fs/promises";
import {getVersion, printVersion} from "./version";

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn()
  }
}));
vi.mock('node:path', () => ({
  default: {
    normalize: vi.fn()
  }
}));

beforeEach(() => {
  vi.mocked(path.normalize).mockReturnValue('normalizedPath');
  vi.mocked(fsPromise.readFile).mockResolvedValue(`
  {
    "version": "1.2.3"
  }
  `);
  vi.stubGlobal('console', {log: vi.fn()});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe('printVersion()', () => {
  test('print version to console', async () => {
    await printVersion();

    expect(console.log).toHaveBeenCalledOnce();
    expect(console.log).toHaveBeenCalledWith('v1.2.3');
  });
});

describe('getVersion()', () => {
  test('return version', async () => {
    const result = await getVersion();

    expect(path.normalize).toHaveBeenCalledOnce();
    expect(vi.mocked(path.normalize).mock.lastCall![0].endsWith('/../../package.json')).toBeTruthy();
    expect(fsPromise.readFile).toHaveBeenCalledOnce();
    expect(fsPromise.readFile).toHaveBeenCalledWith('normalizedPath', {encoding: 'utf8'});
    expect(result).toEqual('v1.2.3')
  });
});
