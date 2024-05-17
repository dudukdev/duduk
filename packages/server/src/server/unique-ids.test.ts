import {afterEach, describe, expect, test, vi} from "vitest";
import {createHash} from "node:crypto";
import {uniqueIdFromString} from "./unique-ids";

vi.mock('node:crypto', () => ({
  createHash: vi.fn()
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe('uniqueIdFromString()', () => {
  test('return unique hash', () => {
    const mockHash = {
      update: vi.fn(),
      digest: vi.fn()
    };
    // @ts-ignore
    vi.mocked(createHash).mockReturnValue(mockHash);
    vi.mocked(mockHash.update).mockReturnValue(mockHash);
    vi.mocked(mockHash.digest).mockReturnValue('asdfQWER1234');

    const result = uniqueIdFromString('someValue');

    expect(createHash).toHaveBeenCalledWith('md5');
    expect(mockHash.update).toHaveBeenCalledWith('someValue');
    expect(mockHash.digest).toHaveBeenCalledWith('hex');
    expect(result).toEqual('asdfqwer1234');
  });
});
