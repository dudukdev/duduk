import {afterEach, beforeEach, expect, test, vi} from "vitest";
import mime from "mime";
import fs from "node:fs";
import {serveFile} from "./serveFile";

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    statSync: vi.fn(),
    createReadStream: vi.fn()
  }
}));
vi.mock('mime', () => ({
  default: {
    getType: vi.fn()
  }
}));

const mockStat = {
  isFile: vi.fn(),
  size: 123
};

beforeEach(() => {
  // @ts-ignore
  vi.mocked(fs.statSync).mockReturnValue(mockStat);
});

afterEach(() => {
  vi.resetAllMocks();
});

test('return true and set file content', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(mockStat.isFile).mockReturnValue(true);
  const mockReadStream = {
    pipe: vi.fn()
  };
  // @ts-ignore
  vi.mocked(fs.createReadStream).mockReturnValue(mockReadStream);
  vi.mocked(mime.getType).mockReturnValue('my/mime');

  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  // @ts-ignore
  const result = serveFile(mockRequest, mockResponse);

  expect(fs.existsSync).toHaveBeenCalledOnce();
  const fileName = vi.mocked(fs.existsSync).mock.lastCall![0] as string;
  expect(fileName.endsWith('/some/file.js')).toBeTruthy();
  expect(fs.statSync).toHaveBeenCalledOnce();
  expect(fs.statSync).toHaveBeenCalledWith(fileName);
  expect(mockStat.isFile).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
    'Content-Type': 'my/mime',
    'Content-Length': '123'
  });
  expect(mockResponse.end).not.toHaveBeenCalled();
  expect(fs.createReadStream).toHaveBeenCalledOnce();
  expect(fs.createReadStream).toHaveBeenCalledWith(fileName);
  expect(mockReadStream.pipe).toHaveBeenCalledOnce();
  expect(mockReadStream.pipe).toHaveBeenCalledWith(mockResponse);
  expect(result).toBeTruthy();
});

test('return true and set file content but not Content-Type if mime type is unknown', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(mockStat.isFile).mockReturnValue(true);
  const mockReadStream = {
    pipe: vi.fn()
  };
  // @ts-ignore
  vi.mocked(fs.createReadStream).mockReturnValue(mockReadStream);
  vi.mocked(mime.getType).mockReturnValue(null);

  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  // @ts-ignore
  const result = serveFile(mockRequest, mockResponse);

  expect(fs.existsSync).toHaveBeenCalledOnce();
  const fileName = vi.mocked(fs.existsSync).mock.lastCall![0] as string;
  expect(fileName.endsWith('/some/file.js')).toBeTruthy();
  expect(fs.statSync).toHaveBeenCalledOnce();
  expect(fs.statSync).toHaveBeenCalledWith(fileName);
  expect(mockStat.isFile).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
    'Content-Length': '123'
  });
  expect(mockResponse.end).not.toHaveBeenCalled();
  expect(fs.createReadStream).toHaveBeenCalledOnce();
  expect(fs.createReadStream).toHaveBeenCalledWith(fileName);
  expect(mockReadStream.pipe).toHaveBeenCalledOnce();
  expect(mockReadStream.pipe).toHaveBeenCalledWith(mockResponse);
  expect(result).toBeTruthy();
});

test('return false and set nothing if path not exists', () => {
  vi.mocked(fs.existsSync).mockReturnValue(false);
  vi.mocked(mockStat.isFile).mockReturnValue(true);
  const mockReadStream = {
    pipe: vi.fn()
  };
  // @ts-ignore
  vi.mocked(fs.createReadStream).mockReturnValue(mockReadStream);
  vi.mocked(mime.getType).mockReturnValue('my/mime');

  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  // @ts-ignore
  const result = serveFile(mockRequest, mockResponse);

  expect(fs.existsSync).toHaveBeenCalledOnce();
  const fileName = vi.mocked(fs.existsSync).mock.lastCall![0] as string;
  expect(fileName.endsWith('/some/file.js')).toBeTruthy();
  expect(fs.statSync).not.toHaveBeenCalled();
  expect(mockStat.isFile).not.toHaveBeenCalled();
  expect(mockResponse.writeHead).not.toHaveBeenCalled();
  expect(mockResponse.end).not.toHaveBeenCalled();
  expect(fs.createReadStream).not.toHaveBeenCalled();
  expect(result).toBeFalsy();
});

test('return false and set nothing if path is outside base dir', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(mockStat.isFile).mockReturnValue(true);
  const mockReadStream = {
    pipe: vi.fn()
  };
  // @ts-ignore
  vi.mocked(fs.createReadStream).mockReturnValue(mockReadStream);
  vi.mocked(mime.getType).mockReturnValue('my/mime');

  const mockRequest = {
    url: '/../some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  // @ts-ignore
  const result = serveFile(mockRequest, mockResponse);

  expect(fs.existsSync).not.toHaveBeenCalled();
  expect(fs.statSync).not.toHaveBeenCalled();
  expect(mockStat.isFile).not.toHaveBeenCalled();
  expect(mockResponse.writeHead).not.toHaveBeenCalled();
  expect(mockResponse.end).not.toHaveBeenCalled();
  expect(fs.createReadStream).not.toHaveBeenCalled();
  expect(result).toBeFalsy();
});

test('return false and set nothing if path is not a file', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(mockStat.isFile).mockReturnValue(false);
  const mockReadStream = {
    pipe: vi.fn()
  };
  // @ts-ignore
  vi.mocked(fs.createReadStream).mockReturnValue(mockReadStream);
  vi.mocked(mime.getType).mockReturnValue('my/mime');

  const mockRequest = {
    url: '/some/file.js',
    method: 'GET'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  // @ts-ignore
  const result = serveFile(mockRequest, mockResponse);

  expect(fs.existsSync).toHaveBeenCalledOnce();
  const fileName = vi.mocked(fs.existsSync).mock.lastCall![0] as string;
  expect(fileName.endsWith('/some/file.js')).toBeTruthy();
  expect(fs.statSync).toHaveBeenCalledOnce();
  expect(fs.statSync).toHaveBeenCalledWith(fileName);
  expect(mockStat.isFile).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).not.toHaveBeenCalled();
  expect(mockResponse.end).not.toHaveBeenCalled();
  expect(fs.createReadStream).not.toHaveBeenCalled();
  expect(result).toBeFalsy();
});

test('return true and set 405 if method is not GET', () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(mockStat.isFile).mockReturnValue(true);
  const mockReadStream = {
    pipe: vi.fn()
  };
  // @ts-ignore
  vi.mocked(fs.createReadStream).mockReturnValue(mockReadStream);
  vi.mocked(mime.getType).mockReturnValue('my/mime');

  const mockRequest = {
    url: '/some/file.js',
    method: 'SOMETHING'
  };
  const mockResponse = {
    writeHead: vi.fn(),
    end: vi.fn()
  };

  // @ts-ignore
  const result = serveFile(mockRequest, mockResponse);

  expect(fs.existsSync).toHaveBeenCalledOnce();
  const fileName = vi.mocked(fs.existsSync).mock.lastCall![0] as string;
  expect(fileName.endsWith('/some/file.js')).toBeTruthy();
  expect(fs.statSync).toHaveBeenCalledOnce();
  expect(fs.statSync).toHaveBeenCalledWith(fileName);
  expect(mockStat.isFile).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledOnce();
  expect(mockResponse.writeHead).toHaveBeenCalledWith(405);
  expect(mockResponse.end).toHaveBeenCalledOnce();
  expect(fs.createReadStream).not.toHaveBeenCalled();
  expect(result).toBeTruthy();
});
