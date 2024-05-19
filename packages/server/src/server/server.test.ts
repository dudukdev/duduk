import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {createServer} from "node:http";
import {serveFile} from "./serve-file/serveFile";
import {serveRoute} from "./serve-route/serveRoute";

vi.mock('node:http', () => ({
  createServer: vi.fn()
}));
vi.mock('./serve-route/serveRoute', () => ({
  serveRoute: vi.fn()
}));
vi.mock('./serve-file/serveFile', () => ({
  serveFile: vi.fn()
}));

const mockServer = {
  listen: vi.fn()
};

beforeEach(() => {
  vi.stubGlobal('process', {
    env: {
      HOST: undefined,
      PORT: undefined
    }
  });
  // @ts-ignore
  vi.mocked(createServer).mockReturnValue(mockServer);
});

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
  vi.resetModules();
});

test('create server with default values', async () => {
  vi.stubGlobal('console', {
    log: vi.fn()
  });

  await import('./server');

  expect(createServer).toHaveBeenCalledOnce();
  expect(createServer).toHaveBeenCalledWith(expect.any(Function));
  expect(mockServer.listen).toHaveBeenCalledOnce();
  expect(mockServer.listen).toHaveBeenCalledWith(8000, '127.0.0.1', expect.any(Function));
  const callback = vi.mocked(mockServer.listen).mock.lastCall![2];
  expect(callback).toBeInstanceOf(Function);
  callback();
  expect(console.log).toHaveBeenCalledOnce();
  expect(console.log).toHaveBeenCalledWith('Server is running on http://127.0.0.1:8000');
});

test('create server with env values', async () => {
  vi.stubGlobal('console', {
    log: vi.fn()
  });
  process.env.HOST = 'someHost';
  process.env.PORT = '4242';

  await import('./server');

  expect(createServer).toHaveBeenCalledOnce();
  expect(createServer).toHaveBeenCalledWith(expect.any(Function));
  expect(mockServer.listen).toHaveBeenCalledOnce();
  expect(mockServer.listen).toHaveBeenCalledWith(4242, 'someHost', expect.any(Function));
  const callback = vi.mocked(mockServer.listen).mock.lastCall![2];
  expect(callback).toBeInstanceOf(Function);
  callback();
  expect(console.log).toHaveBeenCalledOnce();
  expect(console.log).toHaveBeenCalledWith('Server is running on http://someHost:4242');
});

test('only serve file if serveFile returns true', async () => {
  vi.mocked(serveFile).mockReturnValue(true);
  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  await import('./server');

  const listener = vi.mocked(createServer).mock.lastCall![0] as Function;
  await listener(mockRequest, mockResponse);

  expect(serveFile).toHaveBeenCalledOnce();
  expect(serveFile).toHaveBeenCalledWith(mockRequest, mockResponse);
  expect(serveRoute).not.toHaveBeenCalled();
  expect(mockResponse.writeHead).not.toHaveBeenCalled();
  expect(mockResponse.end).not.toHaveBeenCalled();
});

test('serve route if serveFile returns false and serveRoute returns true', async () => {
  vi.mocked(serveFile).mockReturnValue(false);
  vi.mocked(serveRoute).mockResolvedValue(true);
  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  await import('./server');

  const listener = vi.mocked(createServer).mock.lastCall![0] as Function;
  await listener(mockRequest, mockResponse);

  expect(serveFile).toHaveBeenCalledOnce();
  expect(serveFile).toHaveBeenCalledWith(mockRequest, mockResponse);
  expect(serveRoute).toHaveBeenCalledOnce();
  expect(serveRoute).toHaveBeenCalledWith(mockRequest, mockResponse);
  expect(mockResponse.writeHead).not.toHaveBeenCalled();
  expect(mockResponse.end).not.toHaveBeenCalled();
});

test('write 404 if serveFile and serveRoute return false', async () => {
  vi.mocked(serveFile).mockReturnValue(false);
  vi.mocked(serveRoute).mockResolvedValue(false);
  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  await import('./server');

  const listener = vi.mocked(createServer).mock.lastCall![0] as Function;
  await listener(mockRequest, mockResponse);

  expect(serveFile).toHaveBeenCalledOnce();
  expect(serveFile).toHaveBeenCalledWith(mockRequest, mockResponse);
  expect(serveRoute).toHaveBeenCalledOnce();
  expect(serveRoute).toHaveBeenCalledWith(mockRequest, mockResponse);
  expect(mockResponse.writeHead).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledWith(404);
  expect(mockResponse.end).toHaveBeenCalledOnce();
});
