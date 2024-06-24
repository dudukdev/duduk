import type {IncomingMessage, RequestListener} from "node:http";
import type {RoutePart} from "./models";
import {expect, test, vi} from "vitest";
import {executeServer} from "./serveServerEndpoint";

test('execute server endpoint with layout', async () => {
  // @ts-ignore
  const mockRequest: IncomingMessage = {method: 'GET'};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockStack: RoutePart[] = [
    {id: '', layoutServer: {GET: vi.fn()}, parameter: false, routes: new Map()},
    {id: 'route', parameter: false, routes: new Map()},
    {id: 'other', layoutServer: {GET: vi.fn()}, pageServer: {GET: vi.fn()}, parameter: false, routes: new Map()}
  ];
  vi.mocked(mockStack[0].layoutServer!.GET!).mockResolvedValue({some: 'data', more: 'stuff'});
  vi.mocked(mockStack[2].layoutServer!.GET!).mockResolvedValue({some: 'other', any: 'thing'});

  await executeServer(mockRequest, mockResponse, mockStack, {my: 'param'}, {other: 'locals'});

  expect(mockStack[0].layoutServer!.GET).toHaveBeenCalledOnce();
  expect(mockStack[0].layoutServer!.GET).toHaveBeenCalledWith({request: mockRequest, data: {}, locals: {other: 'locals'}});
  expect(mockStack[2].layoutServer!.GET).toHaveBeenCalledOnce();
  expect(mockStack[2].layoutServer!.GET).toHaveBeenCalledWith({request: mockRequest, data: {some: 'data', more: 'stuff'}, locals: {other: 'locals'}});
  expect(mockStack[2].pageServer!.GET).toHaveBeenCalledOnce();
  expect(mockStack[2].pageServer!.GET).toHaveBeenCalledWith({request: mockRequest, response: mockResponse, data: {some: 'other', any: 'thing', more: 'stuff'}, params: {my: 'param'}, locals: {other: 'locals'}});
});

test('execute server endpoint with layout if method not set', async () => {
  // @ts-ignore
  const mockRequest: IncomingMessage = {};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockStack: RoutePart[] = [
    {id: '', layoutServer: {GET: vi.fn()}, parameter: false, routes: new Map()},
    {id: 'route', parameter: false, routes: new Map()},
    {id: 'other', layoutServer: {GET: vi.fn()}, pageServer: {GET: vi.fn()}, parameter: false, routes: new Map()}
  ];
  vi.mocked(mockStack[0].layoutServer!.GET!).mockResolvedValue({some: 'data', more: 'stuff'});
  vi.mocked(mockStack[2].layoutServer!.GET!).mockResolvedValue({some: 'other', any: 'thing'});

  await executeServer(mockRequest, mockResponse, mockStack, {my: 'param'}, {other: 'locals'});

  expect(mockStack[0].layoutServer!.GET).toHaveBeenCalledOnce();
  expect(mockStack[0].layoutServer!.GET).toHaveBeenCalledWith({request: mockRequest, data: {}, locals: {other: 'locals'}});
  expect(mockStack[2].layoutServer!.GET).toHaveBeenCalledOnce();
  expect(mockStack[2].layoutServer!.GET).toHaveBeenCalledWith({request: mockRequest, data: {some: 'data', more: 'stuff'}, locals: {other: 'locals'}});
  expect(mockStack[2].pageServer!.GET).toHaveBeenCalledOnce();
  expect(mockStack[2].pageServer!.GET).toHaveBeenCalledWith({request: mockRequest, response: mockResponse, data: {some: 'other', any: 'thing', more: 'stuff'}, params: {my: 'param'}, locals: {other: 'locals'}});
});
