import {defineBuildConfig} from "unbuild";

export default defineBuildConfig([
  {
    name: '@duduk/components',
    rootDir: './packages/components',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  },
  {
    name: '@duduk/content-negotiation',
    rootDir: './packages/content-negotiation',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  },
  {
    name: '@duduk/cookies',
    rootDir: './packages/cookies',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  },
  {
    name: '@duduk/localization',
    rootDir: './packages/localization',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  },
  {
    name: '@duduk/messaging',
    rootDir: './packages/messaging',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  },
  {
    name: '@duduk/ssr',
    rootDir: './packages/ssr',
    entries: ['./index.ts'],
    declaration: 'node16',
    externals: [
      /@duduk\/.*/ug,
      'jsdom'
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
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
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  },
  {
    name: '@duduk/server server components',
    rootDir: './packages/server',
    entries: [
      './src/server/server.ts',
      './src/bin/index.ts'
    ],
    rollup: {esbuild: {target: 'ESNext'}},
    externals: [
      /@duduk\/.*/ug,
      '@duduk/cookies',
      'jsdom',
      'mime',
      'esbuild'
    ],
    failOnWarn: process.env.NODE_ENV !== 'test'
  }
]);
