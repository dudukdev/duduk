/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "vitest",
  coverageAnalysis: "perTest",
  buildCommand: "npm run build",
  mutate: [
    'packages/**/!(*.test).ts',
    '!**/vitest.config.ts'
  ]
};
export default config;
