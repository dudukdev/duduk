import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [
      'default',
      ['junit', {outputFile: 'reports/junit.xml'}]
    ],
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'text-summary',
        'cobertura'
      ]
    }
  },
})
