import {describe, expect, test, vi} from "vitest";
import {DudukMessenger} from "./messenger";

test('return channel', () => {
  const messenger = new DudukMessenger();
  const channel = messenger.channel('someChannel');
  expect(channel).toEqual({
    dispatch: expect.any(Function),
    addListener: expect.any(Function),
    removeListener: expect.any(Function)
  });
});

describe('listen', () => {
  test('listen to messages', async () => {
    const messenger = new DudukMessenger();
    const channel = messenger.channel('someChannel');

    const listener = vi.fn();
    channel.addListener(listener);

    channel.dispatch('some value to dispatch');

    expect(listener).not.toHaveBeenCalled();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith('some value to dispatch');
  });

  test('multiple listeners', async () => {
    const messenger = new DudukMessenger();
    const channel = messenger.channel('someChannel');

    const listener1 = vi.fn();
    const listener2 = vi.fn();
    channel.addListener(listener1);
    channel.addListener(listener2);

    channel.dispatch('some value to dispatch');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener1).toHaveBeenCalledWith('some value to dispatch');
    expect(listener2).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledWith('some value to dispatch');
  });

  test('listen to messages and call callback', async () => {
    const messenger = new DudukMessenger();
    const channel = messenger.channel('someChannel');

    const listener = vi.fn().mockReturnValue('some return value');
    const callback = vi.fn();
    channel.addListener(listener);

    channel.dispatch('some value to dispatch', callback);

    expect(listener).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith('some value to dispatch');
    expect(callback).not.toHaveBeenCalled();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('some return value');
  });

  test('do not mix up channels from one messenger', async () => {
    const messenger = new DudukMessenger();
    const channel1 = messenger.channel('someChannel');
    const listener1 = vi.fn();
    channel1.addListener(listener1);

    const channel2 = messenger.channel('otherChannel');
    const listener2 = vi.fn();
    channel2.addListener(listener2);

    channel1.dispatch('dispatch 1');
    channel2.dispatch('dispatch 2');

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener1).toHaveBeenCalledWith('dispatch 1');
    expect(listener2).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledWith('dispatch 2');
  });

  test('do not mix up channels from different messenger', async () => {
    const messenger1 = new DudukMessenger();
    const channel1 = messenger1.channel('someChannel');
    const listener1 = vi.fn();
    channel1.addListener(listener1);

    const messenger2 = new DudukMessenger();
    const channel2 = messenger2.channel('someChannel');
    const listener2 = vi.fn();
    channel2.addListener(listener2);

    channel1.dispatch('dispatch 1');
    channel2.dispatch('dispatch 2');

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener1).toHaveBeenCalledWith('dispatch 1');
    expect(listener2).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledWith('dispatch 2');
  });

  test('do not throw on dispatch if no listeners', () => {
    const messenger = new DudukMessenger();
    const channel = messenger.channel('someChannel');

    expect(() => channel.dispatch('some dispatch')).not.toThrowError();
  });
});

describe('remove', () => {
  test('remove listener', async () => {
    const messenger = new DudukMessenger();
    const channel = messenger.channel('someChannel');

    const listener = vi.fn().mockReturnValue('some return value');
    const callback = vi.fn();
    channel.addListener(listener);
    channel.removeListener(listener);
    channel.dispatch('some value to dispatch', callback);

    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(listener).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  test('do not throw on removeListener if no listener', async () => {
    const messenger = new DudukMessenger();
    const channel = messenger.channel('someChannel');

    expect(() => channel.removeListener(vi.fn())).not.toThrowError();
  });
});
