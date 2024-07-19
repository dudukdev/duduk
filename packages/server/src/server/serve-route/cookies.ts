import type {IncomingMessage, RequestListener} from "node:http";
import { parseCookies, createSetCookieHeader, type Cookie } from "@duduk/cookies";

export interface CookieHandler {
  get: (key: string) => string | undefined;
  set: (cookie: Cookie) => void;
}

export function createCookieHandler(req: IncomingMessage, res: Parameters<RequestListener>[1]): CookieHandler {
  const cookies = req.headers.cookie === undefined ? new Map<string, string>() : parseCookies(req.headers.cookie);

  return {
    get: (key: string) => cookies.get(key),
    set: (cookie: Cookie) => res.setHeader('Set-Cookie', createSetCookieHeader(cookie)),
  }
}
