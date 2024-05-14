import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {getVersion} from "./version";
import {printHelp} from "./help";

vi.mock('./version', () => ({
  getVersion: vi.fn()
}));

beforeEach(() => {
  vi.stubGlobal('console', {log: vi.fn()});
  vi.mocked(getVersion).mockResolvedValue('v1.2.3');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

test('print help to console', async () => {
  await printHelp();

  expect(console.log).toHaveBeenCalledOnce();
  expect(console.log).toHaveBeenCalledWith(`Duduk v1.2.3

Usage:
  duduk [options]

Options:
  build                    Bundle the Duduk app
    --watch, -w              Watch for changes and rebuild

  version, --version, -v   Show the version of Duduk
`);
});
