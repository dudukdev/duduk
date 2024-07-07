import type {IncomingMessage, RequestListener} from "node:http";
import type {Middlewares, RoutePart} from "./models";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import fsPromise from "node:fs/promises";
import {getRoutes} from "./parseRoutes";
import {serveRoute} from "./serveRoute";
import {printPage} from "./servePageEndpoint";
import {executeServer} from "./serveServerEndpoint";

/*
/                                        (with Layout, with Page)
/subRoute                                (without Layout, with Page)
/subRoute/subSubRoute                    (with Layout, with Page)
/otherRoute                              (with Layout, without Page)
/otherRoute/(otherGroup)                 (without Layout)
/otherRoute/(otherGroup)/otherSubRoute   (with Layout, with Page)
/otherRoute/[someParam]                  (with Layout, with Page)
/(myGroup)                               (with Layout)
/(myGroup)/moreRoute                     (with Layout, with Page, without PageServer)
 */

const {mockParamRoute, mockSubSubRoute, mockSubRoute, mockOtherSubRoute, mockOtherRoute, mockMoreRoute, mockMyGroup, mockRootRoute} = vi.hoisted(() => {
  const mockParamRoute: RoutePart = {
    id: 'someParam',
    routeId: '/otherRoute/[someParam]',
    type: 'param',
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
    routes: new Map(),
    groupRoutes: []
  };
  const mockSubSubRoute: RoutePart = {
    id: 'subSubRoute',
    routeId: '/subRoute/subSubRoute',
    type: 'path',
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
    routes: new Map(),
    groupRoutes: []
  };
  const mockSubRoute: RoutePart = {
    id: 'subRoute',
    routeId: '/subRoute',
    type: 'path',
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/page-r243.js'
    },
    pageServer: {
      GET: vi.fn()
    },
    routes: new Map([['subSubRoute', mockSubSubRoute]]),
    groupRoutes: []
  };
  const mockOtherSubRoute: RoutePart = {
    id: 'otherSubRoute',
    routeId: '/otherRoute/(otherGroup)/otherSubRoute',
    type: 'path',
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
    routes: new Map(),
    groupRoutes: []
  };
  const mockOtherGroup: RoutePart = {
    id: 'otherGroup',
    routeId: '/otherRoute/(otherGroup)',
    type: 'group',
    routes: new Map([['otherSubRoute', mockOtherSubRoute]]),
    groupRoutes: []
  };
  const mockOtherRoute: RoutePart = {
    id: 'otherRoute',
    routeId: '/otherRoute',
    type: 'path',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/layout-a53f.js'
    },
    layoutServer: {},
    routes: new Map(),
    paramRoute: mockParamRoute,
    groupRoutes: [mockOtherGroup]
  };
  const mockMoreRoute: RoutePart = {
    id: 'moreRoute',
    routeId: '/(myGroup)/moreRoute',
    type: 'path',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/layout-g567.js'
    },
    layoutServer: {},
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/otherRoute/page-hd64.js'
    },
    routes: new Map(),
    paramRoute: mockParamRoute,
    groupRoutes: []
  };
  const mockMyGroup: RoutePart = {
    id: 'myGroup',
    routeId: '/(myGroup)',
    type: 'group',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/(myGroup)/layout-s24f.js'
    },
    routes: new Map([
      ['moreRoute', mockMoreRoute]
    ]),
    groupRoutes: []
  };
  const mockRootRoute: RoutePart = {
    id: '',
    routeId: '',
    type: 'path',
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
    routes: new Map([
      ['subRoute', mockSubRoute],
      ['otherRoute', mockOtherRoute]
    ]),
    groupRoutes: [mockMyGroup]
  };
  return {mockParamRoute, mockSubSubRoute, mockSubRoute, mockOtherSubRoute, mockOtherRoute, mockMoreRoute, mockMyGroup, mockRootRoute};
});
const mockSetupServer: {middlewares: Middlewares | undefined} = vi.hoisted(() => ({
  middlewares: undefined
}));

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
vi.mock('./rootFiles', () => ({
  setupServer: mockSetupServer
}));

beforeEach(() => {
  vi.mocked(fsPromise.readdir).mockResolvedValue([]);
  vi.mocked(getRoutes).mockResolvedValue(mockRootRoute);
  mockSetupServer.middlewares = undefined;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('print page', () => {
  test('root, "/"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {}, {}, '');
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
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {}, {}, '');
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
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {}, {}, '');
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
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubRoute], {}, {}, '/subRoute');
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
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubSubRoute], {}, {}, '/subRoute/subSubRoute');
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

  test('with layout, with page, "/otherRoute/(otherGroup)/otherSubRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute/otherSubRoute', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockOtherSubRoute], {}, {}, '/otherRoute/(otherGroup)/otherSubRoute');
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
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockParamRoute], {someParam: 'someAsdf'}, {}, '/otherRoute/[someParam]');
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test('group route, "/(myGroup)/moreRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/moreRoute', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockMyGroup, mockMoreRoute], {}, {}, '/(myGroup)/moreRoute');
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

  test('execute middlewares and pass locales', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
    mockSetupServer.middlewares = [
      vi.fn().mockImplementation(async ({event, resolve}) => {
        event.locals = {my: 'stuff', other: 'things'};
        return await resolve(event);
      }),
      vi.fn().mockImplementation(async ({event, resolve}) => {
        event.locals.my = 'local';
        event.locals.some = 'type';
        return await resolve(event);
      })
    ];

    const result = await serveRoute(mockRequest, mockResponse);

    expect(mockSetupServer.middlewares[0]).toHaveBeenCalledOnce();
    expect(mockSetupServer.middlewares[1]).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledOnce();
    expect(printPage).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {}, {my: 'local', other: 'things', some: 'type'}, '');
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
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
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {}, {}, '');
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
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubRoute], {}, {}, '/subRoute');
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
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockSubSubRoute], {}, {}, '/subRoute/subSubRoute');
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

  test('with layout, with page, "/otherRoute/(otherGroup)/otherSubRoute"', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/otherRoute/otherSubRoute', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockOtherSubRoute], {}, {}, '/otherRoute/(otherGroup)/otherSubRoute');
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
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute, mockOtherRoute, mockParamRoute], {someParam: 'someAsdf'}, {}, '/otherRoute/[someParam]');
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

  test('execute middlewares and pass locales', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/', method: 'GET', headers: {host: 'localhost', accept: 'application/json'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
    mockSetupServer.middlewares = [
      vi.fn().mockImplementation(async ({event, resolve}) => {
        event.locals = {my: 'stuff', other: 'things'};
        return await resolve(event);
      }),
      vi.fn().mockImplementation(async ({event, resolve}) => {
        event.locals.my = 'local';
        event.locals.some = 'type';
        return await resolve(event);
      })
    ];

    const result = await serveRoute(mockRequest, mockResponse);

    expect(mockSetupServer.middlewares[0]).toHaveBeenCalledOnce();
    expect(mockSetupServer.middlewares[1]).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledOnce();
    expect(executeServer).toHaveBeenCalledWith(mockRequest, mockResponse, [mockRootRoute], {}, {my: 'local', other: 'things', some: 'type'}, '');
    expect(printPage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
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

describe('return false (aka 404)', () => {
  test('if groupRoute is addressed directly', async () => {
    // @ts-ignore
    const mockRequest: IncomingMessage = {url: '/(myGroup)', method: 'GET', headers: {host: 'localhost', accept: 'text/html'}};
    // @ts-ignore
    const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};

    const result = await serveRoute(mockRequest, mockResponse);

    expect(printPage).not.toHaveBeenCalled();
    expect(executeServer).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });

  test.each(['text/html', 'application/json', 'image/png'])('if route not defined, with accept %s', async (accept) => {
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
