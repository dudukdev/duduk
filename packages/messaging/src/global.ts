import type {Channel} from "./models";
import {DudukMessenger} from "./messenger";

export function channel<T = any, R = any>(name: string): Channel<T, R> {
  if (window.__duduk?.messengerInstance === undefined) {
    window.__duduk ??= {};
    window.__duduk.messengerInstance = new DudukMessenger();
  }
  return (window.__duduk.messengerInstance as DudukMessenger).channel<T, R>(name);
}
