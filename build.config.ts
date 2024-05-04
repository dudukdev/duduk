import { defineBuildConfig } from "unbuild";

export default defineBuildConfig([
    {
        rootDir: './packages/components',
        entries: ['./index.ts'],
        declaration: 'node16',
        externals: [
            /@duduk\/.*/ug,
        ]
    },
    {
        rootDir: './packages/content-negotiation',
        entries: ['./index.ts'],
        declaration: 'node16',
        externals: [
            /@duduk\/.*/ug,
        ]
    },
    {
        rootDir: './packages/localization',
        entries: ['./index.ts'],
        declaration: 'node16',
        externals: [
            /@duduk\/.*/ug,
        ]
    },
    {
        rootDir: './packages/server',
        entries: [
          './index.ts',
          './src/bin/bundle.ts',
          './src/inject/locales.ts'
        ],
        declaration: 'node16',
        externals: [
            /@duduk\/.*/ug,
            'jsdom',
            'mime',
            'esbuild'
        ]
    }
]);
