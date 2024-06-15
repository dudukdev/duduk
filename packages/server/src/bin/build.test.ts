import * as esbuild from 'esbuild';
import fs from "node:fs";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {build} from "./build";

vi.mock('esbuild', () => ({
  context: vi.fn(),
  build: vi.fn()
}));
vi.mock('node:fs', () => ({
  default: {
    rmSync: vi.fn(),
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(),
    lstatSync: vi.fn(),
    existsSync: vi.fn()
  }
}));

beforeEach(() => {
  // @ts-ignore
  vi.mocked(fs.readdirSync).mockImplementation((path) => {
    const filesTs = ['page.ts', 'pageServer.ts', 'layout.ts', 'layoutServer.ts'];
    const filesJs = ['page.js', 'pageServer.js', 'layout.js', 'layoutServer.js'];
    switch (path) {
      case 'src/routes':
        return [...filesTs, 'subroute'].sort();
      case 'src/routes/subroute':
        return [...filesJs, 'otherSubRoute'].sort();
      case 'src/routes/subroute/otherSubRoute':
        return [...filesTs, ...filesJs].sort();
      default:
        return [];
    }
  });
  // @ts-ignore
  vi.mocked(fs.lstatSync).mockImplementation((path) => {
    const paths = [
      'src/routes/subroute',
      'src/routes/subroute/otherSubRoute'
    ];
    return {
      isFile: () => !paths.includes(path as string),
      isDirectory: () => paths.includes(path as string)
    };
  });
  vi.mocked(fs.existsSync).mockImplementation((path) => {
    return [
      'src',
      'src/app.css',
      'src/root.css',
      'src/setupServer.ts',
      'src/setupClient.js',
      'src/routes',
      'src/routes/layout.ts',
      'src/routes/layoutServer.ts',
      'src/routes/page.ts',
      'src/routes/pageServer.ts',
      'src/routes/subroute',
      'src/routes/subroute/layout.js',
      'src/routes/subroute/layoutServer.js',
      'src/routes/subroute/page.js',
      'src/routes/subroute/pageServer.js',
      'src/routes/subroute/otherSubRoute',
      'src/routes/subroute/otherSubRoute/layout.js',
      'src/routes/subroute/otherSubRoute/layout.ts',
      'src/routes/subroute/otherSubRoute/layoutServer.js',
      'src/routes/subroute/otherSubRoute/layoutServer.ts',
      'src/routes/subroute/otherSubRoute/page.js',
      'src/routes/subroute/otherSubRoute/page.ts',
      'src/routes/subroute/otherSubRoute/pageServer.js',
      'src/routes/subroute/otherSubRoute/pageServer.ts'
    ].includes(path as string);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

test('call build with files', async () => {
  await build(false);

  expect(fs.rmSync).toHaveBeenCalledWith('dist', {recursive: true, force: true});
  expect(fs.mkdirSync).toHaveBeenCalledWith('dist/__app', {recursive: true});
  expect(fs.readdirSync).toHaveBeenCalledTimes(3);
  expect(fs.lstatSync).toHaveBeenCalledTimes(18);

  expect(esbuild.build).toHaveBeenCalledTimes(2);
  expect(esbuild.build).toHaveBeenCalledWith({
    entryPoints: [
      'src/routes/layout.ts',
      'src/routes/layoutServer.ts',
      'src/routes/page.ts',
      'src/routes/pageServer.ts',
      'src/routes/subroute/layout.js',
      'src/routes/subroute/layoutServer.js',
      'src/routes/subroute/page.js',
      'src/routes/subroute/pageServer.js',
      'src/routes/subroute/otherSubRoute/layout.js',
      'src/routes/subroute/otherSubRoute/layoutServer.js',
      'src/routes/subroute/otherSubRoute/page.js',
      'src/routes/subroute/otherSubRoute/pageServer.js',
      'src/app.css',
      'src/root.css',
      'src/setupServer.ts',
      'src/setupClient.js',
      'inject/locales.mjs',
    ],
    entryNames: '[dir]/[name]-[hash]',
    nodePaths: [
      'node_modules/@duduk/server/dist',
    ],
    outbase: "src",
    bundle: true,
    outdir: 'dist/__app',
    format: 'esm',
    splitting: true,
    treeShaking: true,
    minify: true,
    loader: {
      '.ttf': 'file',
      '.woff2': 'file',
    },
    external: ['node*'],
    sourcemap: 'linked',
  });
  expect(esbuild.build).toHaveBeenCalledWith({
    entryPoints: [{in: 'node_modules/@duduk/server/dist/server/server.mjs', out: 'index'}],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'esm',
    external: ['jsdom', 'mime']
  });

  expect(esbuild.context).not.toHaveBeenCalled();
});

test('call watch with files', async () => {
  const mockContext = {watch: vi.fn()};
  // @ts-ignore
  vi.mocked(esbuild.context).mockResolvedValue(mockContext);

  await build(true);
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(fs.rmSync).toHaveBeenCalledWith('dist', {recursive: true, force: true});
  expect(fs.mkdirSync).toHaveBeenCalledWith('dist/__app', {recursive: true});
  expect(fs.readdirSync).toHaveBeenCalledTimes(3);
  expect(fs.lstatSync).toHaveBeenCalledTimes(18);

  expect(esbuild.context).toHaveBeenCalledTimes(2);
  expect(esbuild.context).toHaveBeenCalledWith({
    entryPoints: [
      'src/routes/layout.ts',
      'src/routes/layoutServer.ts',
      'src/routes/page.ts',
      'src/routes/pageServer.ts',
      'src/routes/subroute/layout.js',
      'src/routes/subroute/layoutServer.js',
      'src/routes/subroute/page.js',
      'src/routes/subroute/pageServer.js',
      'src/routes/subroute/otherSubRoute/layout.js',
      'src/routes/subroute/otherSubRoute/layoutServer.js',
      'src/routes/subroute/otherSubRoute/page.js',
      'src/routes/subroute/otherSubRoute/pageServer.js',
      'src/app.css',
      'src/root.css',
      'src/setupServer.ts',
      'src/setupClient.js',
      'inject/locales.mjs',
    ],
    entryNames: '[dir]/[name]-[hash]',
    nodePaths: [
      'node_modules/@duduk/server/dist',
    ],
    outbase: "src",
    bundle: true,
    outdir: 'dist/__app',
    format: 'esm',
    splitting: true,
    treeShaking: true,
    minify: true,
    loader: {
      '.ttf': 'file',
      '.woff2': 'file',
    },
    external: ['node*'],
    sourcemap: 'linked',
  });
  expect(esbuild.context).toHaveBeenCalledWith({
    entryPoints: [{in: 'node_modules/@duduk/server/dist/server/server.mjs', out: 'index'}],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'esm',
    external: ['jsdom', 'mime']
  });
  expect(mockContext.watch).toHaveBeenCalledTimes(2);
});
