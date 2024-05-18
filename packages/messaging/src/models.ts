export type DispatchCallbackFn<R> = (value: R) => void | Promise<void>;
export type ChannelListenerFn<T, R> = (value: T) => (void | R) | Promise<(void | R)>;

export interface Channel<T, R> {
  dispatch: (value: T, callback?: DispatchCallbackFn<R>) => void;
  addListener: (listener: ChannelListenerFn<T, R>) => void;
  removeListener: (listener: ChannelListenerFn<T, R>) => void;
}
