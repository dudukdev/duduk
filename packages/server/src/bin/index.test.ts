import {afterEach, describe, expect, test, vi} from "vitest";
import {printHelp} from "./help";
import {printVersion} from "./version";
import {build} from "./build";
import fsPromise from "node:fs/promises";
import path from "node:path";

vi.mock('./build', () => ({build: vi.fn()}));
vi.mock('./help', () => ({printHelp: vi.fn()}));
vi.mock('./version', () => ({printVersion: vi.fn()}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
  vi.resetModules();
});

test('contains hash-bang', async () => {
  const indexFile = await fsPromise.readFile(path.normalize(`${import.meta.dirname}/index.ts`), {encoding: 'utf8'});
  const firstLine = indexFile.split('\n', 1)[0].trim();
  expect(firstLine).toEqual('#!/usr/bin/env node');
});

describe('print help', () => {
  test('argv only -h', async () => {
    vi.stubGlobal('process', {argv: ['', '', '-h']});
    await import('./index');
    expect(printHelp).toHaveBeenCalledOnce();
  });

  test('argv only --help', async () => {
    vi.stubGlobal('process', {argv: ['', '', '--help']});
    await import('./index');
    expect(printHelp).toHaveBeenCalledOnce();
  });

  test('argv contains -h', async () => {
    vi.stubGlobal('process', {argv: ['', '', 'asdf', '-h']});
    await import('./index');
    expect(printHelp).toHaveBeenCalledOnce();
  });

  test('argv contains --help', async () => {
    vi.stubGlobal('process', {argv: ['', '', 'asdf', '--help']});
    await import('./index');
    expect(printHelp).toHaveBeenCalledOnce();
  });

  test('argv no command', async () => {
    vi.stubGlobal('process', {argv: ['', '']});
    await import('./index');
    expect(printHelp).toHaveBeenCalledOnce();
  });

  test('argv unknown command', async () => {
    vi.stubGlobal('process', {argv: ['', '', 'unknown']});
    await import('./index');
    expect(printHelp).toHaveBeenCalledOnce();
  });
});

describe('print version', () => {
  test('argv version', async () => {
    vi.stubGlobal('process', {argv: ['', '', 'version']});
    await import('./index');
    expect(printVersion).toHaveBeenCalledOnce();
  });

  test('argv --version', async () => {
    vi.stubGlobal('process', {argv: ['', '', '--version']});
    await import('./index');
    expect(printVersion).toHaveBeenCalledOnce();
  });

  test('argv -v', async () => {
    vi.stubGlobal('process', {argv: ['', '', '-v']});
    await import('./index');
    expect(printVersion).toHaveBeenCalledOnce();
  });
});

describe('build', () => {
  test('argv build', async () => {
    vi.stubGlobal('process', {argv: ['', '', 'build']});
    await import('./index');
    expect(build).toHaveBeenCalledOnce();
    expect(build).toHaveBeenCalledWith(false);
  });

  test('argv build --watch', async () => {
    vi.stubGlobal('process', {argv: ['', '', 'build', '--watch']});
    await import('./index');
    expect(build).toHaveBeenCalledOnce();
    expect(build).toHaveBeenCalledWith(true);
  });
});
