import type {IncomingMessage, RequestListener} from "node:http";
import {expect, test, vi} from "vitest";
import {createCookieHandler} from "./cookies";

test('create cookie handler', () => {
  // @ts-expect-error
  const mockRequest: IncomingMessage = {headers: {cookie: 'MyCookie=someValue'}};
  // @ts-expect-error
  const mockResponse: Parameters<RequestListener>[1] = {setHeader: vi.fn()};

  const result = createCookieHandler(mockRequest, mockResponse);

  expect(result).toEqual({get: expect.any(Function), set: expect.any(Function)})
  expect(result.get('MyCookie')).toEqual('someValue');

  result.set({key: 'Other', value: 'thing'});

  expect(mockResponse.setHeader).toHaveBeenCalledOnce();
  expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', 'Other=thing');
});

test('work if cookie header not defined', () => {
  // @ts-expect-error
  const mockRequest: IncomingMessage = {headers: {}};
  // @ts-expect-error
  const mockResponse: Parameters<RequestListener>[1] = {setHeader: vi.fn()};

  const result = createCookieHandler(mockRequest, mockResponse);

  expect(result).toEqual({get: expect.any(Function), set: expect.any(Function)})
  expect(result.get('MyCookie')).toEqual(undefined);

  result.set({key: 'Other', value: 'thing'});

  expect(mockResponse.setHeader).toHaveBeenCalledOnce();
  expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', 'Other=thing');
});
