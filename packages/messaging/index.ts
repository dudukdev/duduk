declare global {
  interface Window {
    __duduk?: Record<string, any>
  }
}

export type {Channel, DispatchCallbackFn, ChannelListenerFn} from './src/models';
export {channel} from './src/global';
export {DudukMessenger} from './src/messenger';
