import type {Channel, ChannelListenerFn, DispatchCallbackFn} from "./models";

export class DudukMessenger {

  #channelListeners = new Map<string, ChannelListenerFn<any, any>[]>;

  channel<T = any, R = any>(name: string): Channel<T, R> {
    return {
      dispatch: (value, callback) => this.#dispatch(name, value, callback),
      addListener: (listener) => this.#addListener(name, listener),
      removeListener: (listener) => this.#removeListener(name, listener)
    } satisfies Channel<T, R>;
  }

  #dispatch(channelName: string, value: any, callback: DispatchCallbackFn<any> | undefined): void {
    // Use task queue, not microtask queue
    setTimeout(async () => {
      const listeners = this.#channelListeners.get(channelName) ?? [];
      for (const listener of listeners) {
        const result = await listener(value);
        if (result !== undefined && callback !== undefined) {
          setTimeout(() => callback(result), 0);
        }
      }
    }, 0);
  }

  #addListener(channelName: string, listener: ChannelListenerFn<any, any>): void {
    if (!this.#channelListeners.has(channelName)) {
      this.#channelListeners.set(channelName, []);
    }
    this.#channelListeners.get(channelName)!.push(listener);
  }

  #removeListener(channelName: string, listener: ChannelListenerFn<any, any>): void {
    const listeners = this.#channelListeners.get(channelName);
    if (listeners === undefined) {
      return;
    }
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

}
