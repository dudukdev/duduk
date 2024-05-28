import type {RoutePart} from "./models";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import fsPromise from "node:fs/promises";
import {getRoutes} from "./parseRoutes";
import type {IncomingMessage, RequestListener} from "node:http";
import {serveRoute} from "./serveRoute";
import {printPage} from "./servePageEndpoint";
import {executeServer} from "./serveServerEndpoint";

/*
/                           (with Layout, with Page)
/subRoute                   (without Layout, with Page)
/subRoute/subSubRoute       (with Layout, with Page)
/otherRoute                 (with Layout, without Page)
/otherRoute/otherSubRoute   (with Layout, with Page)
/otherRoute/[someParam]     (with Layout, with Page)
/moreRoute                  (with Layout, with Page, without PageServer)
 */

const {mockParamRoute, mockSubSubRoute, mockSubRoute, mockOtherSubRoute, mockOtherRoute, mockRootRoute} = vi.hoisted(() => {
  const mockParamRoute: RoutePart = {
    id: 'someParam',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/[someParam]/layout-kd64.js'
    },
    layoutServer: {},
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/[someParam]/page-936f.js'
    },
    pageServer: {
      GET: vi.fn()
    },
    parameter: true,
    routes: new Map()
  };
  const mockSubSubRoute: RoutePart = {
    id: 'subSubRoute',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/layout-735r.js'
    },
    layoutServer: {},
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/page-dfe3.js'
    },
    pageServer: {
      GET: vi.fn()
    },
    parameter: false,
    routes: new Map()
  };
  const mockSubRoute: RoutePart = {
    id: 'subRoute',
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/page-r243.js'
    },
    pageServer: {
      GET: vi.fn()
    },
    parameter: false,
    routes: new Map([['subSubRoute', mockSubSubRoute]])
  };
  const mockOtherSubRoute: RoutePart = {
    id: 'otherSubRoute',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/layout-937r.js'
    },
    layoutServer: {},
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/page-365r.js'
    },
    pageServer: {
      GET: vi.fn()
    },
    parameter: false,
    routes: new Map()
  };
  const mockOtherRoute: RoutePart = {
    id: 'otherRoute',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/layout-a53f.js'
    },
    layoutServer: {},
    parameter: false,
    routes: new Map([['otherSubRoute', mockOtherSubRoute]]),
    paramRoute: mockParamRoute
  };
  const mockMoreRoute: RoutePart = {
    id: 'moreRoute',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/layout-g567.js'
    },
    layoutServer: {},
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/page-hd64.js'
    },
    parameter: false,
    routes: new Map(),
    paramRoute: mockParamRoute
  };
  const mockRootRoute: RoutePart = {
    id: '',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/layout-hd6e.js'
    },
    layoutServer: {},
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/page-q524.js'
    },
    pageServer: {
      GET: vi.fn()
    },
    parameter: false,
    routes: new Map([
      ['subRoute', mockSubRoute],
      ['otherRoute', mockOtherRoute],
      ['moreRoute', mockMoreRoute]
    ])
  };
  return {mockParamRoute, mockSubSubRoute, mockSubRoute, mockOtherSubRoute, mockOtherRoute, mockRootRoute};
});

vi.mock('node:fs/promises', () => ({
  default: {
    readdir: vi.fn().mockResolvedValue([])
  }
}));
vi.mock('./parseRoutes', () => ({
  getRoutes: vi.fn().mockResolvedValue(mockRootRoute)
}));
vi.mock('./servePageEndpoint', () => ({
  printPage: vi.fn()
}));
vi.mock('./serveServerEndpoint', () => ({
  executeServer: vi.fn()
}));

beforeEach(() => {
  vi.mocked(fsPromise.readdir).mockResolvedValue([]);
  vi.mocked(getRoutes).mockResolvedValue(mockRootRoute);
});

afterEach(() => {
  vi.resetAllMocks();
});

test('execute setupServer.js', async () => {
  // @ts-ignore
  vi.mocked(fsPromise.readdir).mockResolvedValue(['something.js', 'setupServer-asdf.js', 'other.css']);
  const mockImportFactory = vi.fn().mockReturnValue({});
  vi.doMock(`${import.meta.dirname}/__app/setupServer-asdf.js`, mockImportFactory);
  vi.resetModules();

  await import('./serveRoute');

  expect(mockImportFactory).toHaveBeenCalledOnce();
});

describe('print page', () => {
  test('root, "/"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('root, "/", no method defined', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('root, "/", no url defined', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('without layout, with page, "/subRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/subRoute', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubRoute], {});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('with layout, with page, "/subRoute/subSubRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/subRoute/subSubRoute', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubSubRoute], {});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('with layout, without page, "/otherRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).not.toHaveBeenCalled();
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('with layout, with page, "/otherRoute/otherSubRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute/otherSubRoute', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockOtherSubRoute], {});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('param route, "/otherRoute/someAsdf"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute/someAsdf', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockParamRoute], {someParam: 'someAsdf'});
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  describe('return 405', () => {
    test.each(['POST', 'PUT', 'PATCH', 'DELETE'])('if method %s', async (method) => {
      // @ts-ignore
      const mockRequest: IncomingMessage = {url: '/', method, headers: {host: 'localhost', accept: 'text/html'}};
      // @ts-ignore
      const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

      const result = await serveRoute(mockRequest, mockResponse);

      expect(printPage).not.toHaveBeenCalled();
      expect(executeServer).not.toHaveBeenCalled();
      expect(result).toBeTruthy();
      expect(mockResponse.writeHead).toHaveBeenCalledWith(405);
      expect(mockResponse.end).toHaveBeenCalledOnce();
    });
  });
});

describe('execute server', () => {
  test('root, "/"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {});
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('without layout, with page, "/subRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/subRoute', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubRoute], {});
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('with layout, with page, "/subRoute/subSubRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/subRoute/subSubRoute', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubSubRoute], {});
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('with layout, without page, "/otherRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).not.toHaveBeenCalled();
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('with layout, with page, "/otherRoute/otherSubRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute/otherSubRoute', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockOtherSubRoute], {});
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('param route, "/otherRoute/someAsdf"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute/someAsdf', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockParamRoute], {someParam: 'someAsdf'});
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('return 405 if method not defined', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', method: 'POST', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).not.toHaveBeenCalled();
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).toHaveBeenCalledWith(405);
    expect(mockResponse.end).toHaveBeenCalledOnce();
  });

  test('return 405 if no pageServer defined', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/moreRoute', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).not.toHaveBeenCalled();
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).toHaveBeenCalledWith(405);
    expect(mockResponse.end).toHaveBeenCalledOnce();
  });
});

test('return 406 if unsupported accept header', async () => {
  // @ts-ignore
  const mockRequest: IncomingMessage = {url: '/', method: 'POST', headers: {host: 'localhost', accept: 'image/png'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

  const result = await serveRoute(mockRequest, mockResponse);

  expect(executeServer).not.toHaveBeenCalled();
  expect(printPage).not.toHaveBeenCalled();
  expect(result).toBeTruthy();
  expect(mockResponse.writeHead).toHaveBeenCalledWith(406);
  expect(mockResponse.end).toHaveBeenCalledOnce();
});

test('return 406 if no accept header', async () => {
  // @ts-ignore
  const mockRequest: IncomingMessage = {url: '/', method: 'POST', headers: {host: 'localhost'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

  const result = await serveRoute(mockRequest, mockResponse);

  expect(executeServer).not.toHaveBeenCalled();
  expect(printPage).not.toHaveBeenCalled();
  expect(result).toBeTruthy();
  expect(mockResponse.writeHead).toHaveBeenCalledWith(406);
  expect(mockResponse.end).toHaveBeenCalledOnce();
});

describe('return undefined if route not defined', () => {
  test.each(['text/html', 'application/json', 'image/png'])('%s', async (accept) => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/asdf', method: 'GET', headers: {host: 'localhost', accept}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).not.toHaveBeenCalled();
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });
});
