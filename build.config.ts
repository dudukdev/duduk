import {defineBuildConfig} from "unbuild";

export default defineBuildConfig([
  {
    name: '@duduk/components',
    rootDir: './packages/components',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ]
  },
  {
    name: '@duduk/content-negotiation',
    rootDir: './packages/content-negotiation',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ]
  },
  {
    name: '@duduk/localization',
    rootDir: './packages/localization',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ]
  },
  {
    name: '@duduk/server client components',
    rootDir: './packages/server',
    entries: [
      './index.ts',
      './src/inject/locales.ts',
    ],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
      'jsdom',
      'mime',
      'esbuild'
    ]
  },
  {
    name: '@duduk/server server components',
    rootDir: './packages/server',
    entries: [
      './src/server/index.ts',
      './src/bin/index.ts'
    ],
    rollup: {esbuild: {target: 'ESNext'}},
    externals: [
      /@duduk\/.*/ug,
      'jsdom',
      'mime',
      'esbuild'
    ]
  }
]);
