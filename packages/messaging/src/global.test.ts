import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {DudukMessenger} from "./messenger";
import {channel} from "./global";

vi.mock('./messenger', () => ({
  DudukMessenger: vi.fn()
}));

beforeEach(() => {
  vi.stubGlobal('window', {});
});

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});

test('return channel from global messenger instance', () => {
  const mockChannel = {mock: 'channel'};
  const mockMessenger = {channel: vi.fn().mockReturnValue(mockChannel)};
  vi.stubGlobal('window', {__duduk: {messengerInstance: mockMessenger}});

  const result = channel('someChannel');

  expect(mockMessenger.channel).toHaveBeenCalledOnce();
  expect(mockMessenger.channel).toHaveBeenCalledWith('someChannel');
  expect(result).toEqual(mockChannel);
});

test('create messenger if not existent in __duduk and return channel', () => {
  const mockChannel = {mock: 'channel'};
  const mockMessenger = {channel: vi.fn().mockReturnValue(mockChannel)};
  vi.stubGlobal('window', {__duduk: {}});
  // @ts-ignore
  vi.mocked(DudukMessenger).mockReturnValue(mockMessenger);

  const result = channel('someChannel');

  expect(mockMessenger.channel).toHaveBeenCalledOnce();
  expect(mockMessenger.channel).toHaveBeenCalledWith('someChannel');
  expect(result).toEqual(mockChannel);
  expect(window.__duduk!.messengerInstance).toEqual(mockMessenger);
});

test('create messenger if __duduk not existent and return channel', () => {
  const mockChannel = {mock: 'channel'};
  const mockMessenger = {channel: vi.fn().mockReturnValue(mockChannel)};
  vi.stubGlobal('window', {});
  // @ts-ignore
  vi.mocked(DudukMessenger).mockReturnValue(mockMessenger);

  const result = channel('someChannel');

  expect(mockMessenger.channel).toHaveBeenCalledOnce();
  expect(mockMessenger.channel).toHaveBeenCalledWith('someChannel');
  expect(result).toEqual(mockChannel);
  expect(window.__duduk!.messengerInstance).toEqual(mockMessenger);
});
