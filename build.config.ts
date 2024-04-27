import { defineBuildConfig } from "unbuild";

export default defineBuildConfig([
    {
        rootDir: './packages/components',
        entries: ['./index.ts'],
        declaration: 'node16',
        externals: [
            /@framework\/.*/ug,
        ]
    },
    {
        rootDir: './packages/content-negotiation',
        entries: ['./index.ts'],
        declaration: 'node16',
        externals: [
            /@framework\/.*/ug,
        ]
    },
    {
        rootDir: './packages/localization',
        entries: ['./index.ts'],
        declaration: 'node16',
        externals: [
            /@framework\/.*/ug,
        ]
    },
    {
        rootDir: './packages/server',
        entries: ['./index.ts', './src/bin/bundle.ts'],
        declaration: 'node16',
        externals: [
            /@framework\/.*/ug,
            'jsdom',
            'mime',
            'esbuild'
        ]
    }
]);
