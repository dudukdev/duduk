import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [
      'default',
      ['junit', {outputFile: 'reports/junit.xml'}]
    ],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'text-summary',
        'json',
        'json-summary',
        'cobertura'
      ],
      reportOnFailure: true,
      exclude: [
        'vitest.workspace.ts',
        'stryker.config.js',
        'packages/server/src/server/serve-route/__app/**'
      ]
    }
  },
});
