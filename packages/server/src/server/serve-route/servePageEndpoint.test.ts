import type {IncomingMessage, RequestListener} from "node:http";
import type {RoutePart} from "./models";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {printPage} from "./servePageEndpoint";
import {ssr} from "@duduk/ssr";
import type {CookieHandler} from "./cookies";

vi.mock('@duduk/ssr', () => ({
  ssr: vi.fn()
}));
vi.mock('./rootFiles', () => ({
  appCss: undefined,
  getLocaleStrings: undefined,
  rootCss: undefined,
  setupClient: undefined
}));

beforeEach(() => {
  vi.mocked(ssr).mockResolvedValue('server-side rendered html');
});

afterEach(() => {
  vi.resetAllMocks();
});

test('serve rendered html root route without layout', async () => {
  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {},
      pageParams: {}
    },
    [],
    'https://domain.com/'
  );
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{},"pageParams":{}};
    </script>
    <script type="module">
        import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html root route with layout', async () => {
  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    layout: {path: '/__app/routes/layout-hd6e.js', id: 'ftzzt967gi67'},
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-layout-ftzzt967gi67><fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f></fw-layout-ftzzt967gi67>',
    'import Layoutftzzt967gi67 from "/__app/routes/layout-hd6e.js";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-layout-ftzzt967gi67", Layoutftzzt967gi67);customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {},
      pageParams: {}
    },
    [],
    'https://domain.com/'
  );
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{},"pageParams":{}};
    </script>
    <script type="module">
        import Layoutftzzt967gi67 from "/__app/routes/layout-hd6e.js";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-layout-ftzzt967gi67", Layoutftzzt967gi67);customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html root route with layout data', async () => {
  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    layoutServer: {
      data: vi.fn().mockResolvedValue({some: 'layoutData'})
    },
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {some: 'locals'}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(mockRouteStack[0].layoutServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[0].layoutServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {}, params: {}, locals: {some: 'locals'}, routeId: '', cookies: mockCookieHandler});
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {some: 'layoutData'},
      pageParams: {}
    },
    [],
    'https://domain.com/'
  );
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{"some":"layoutData"},"pageParams":{}};
    </script>
    <script type="module">
        import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html root route with page data', async () => {
  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    pageServer: {
      data: async () => ({some: 'pageData'})
    },
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {some: 'pageData'},
      pageParams: {}
    },
    [],
    'https://domain.com/'
  );
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{"some":"pageData"},"pageParams":{}};
    </script>
    <script type="module">
        import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html sub route with layout, sub layout and data', async () => {
  const mockRouteStack: RoutePart[] = [
    {
      id: '',
      routeId: '',
      type: 'path',
      page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
      layout: {path: '/__app/routes/layout-hd6e.js', id: 'ftzzt967gi67'},
      pageServer: {
        data: vi.fn().mockResolvedValue({some: 'pageData', any: 'something from page'})
      },
      layoutServer: {
        data: vi.fn().mockResolvedValue({some: 'layoutData', other: 'data from layout'})
      },
      routes: new Map(),
      groupRoutes: []
    },
    {
      id: 'otherRoute',
      routeId: '/otherRoute',
      type: 'path',
      page: {path: '/__app/routes/page-u97z.js', id: 'p7t86fuziuhs'},
      layout: {path: '/__app/routes/layout-63re.js', id: 'lhuo8z7it6ug'},
      pageServer: {
        data: vi.fn().mockResolvedValue({some: 'subPageData', else: 'something from sub page'})
      },
      layoutServer: {
        data: vi.fn().mockResolvedValue({some: 'subLayoutData', more: 'from sub layout'})
      },
      routes: new Map(),
      groupRoutes: []
    }
  ];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/otherRoute'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {some: 'locals'}, '/otherRoute', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(mockRouteStack[0].pageServer!.data).not.toHaveBeenCalled();
  expect(mockRouteStack[0].layoutServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[0].layoutServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {}, params: {}, locals: {some: 'locals'}, routeId: '/otherRoute', cookies: mockCookieHandler});
  expect(mockRouteStack[1].layoutServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[1].layoutServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {some: 'layoutData', other: 'data from layout'}, params: {}, locals: {some: 'locals'}, routeId: '/otherRoute', cookies: mockCookieHandler});
  expect(mockRouteStack[1].pageServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[1].pageServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {some: 'subLayoutData', other: 'data from layout', more: 'from sub layout'}, params: {}, locals: {some: 'locals'}, routeId: '/otherRoute', cookies: mockCookieHandler});
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-layout-ftzzt967gi67><fw-layout-lhuo8z7it6ug><fw-page-p7t86fuziuhs></fw-page-p7t86fuziuhs></fw-layout-lhuo8z7it6ug></fw-layout-ftzzt967gi67>',
    'import Layoutftzzt967gi67 from "/__app/routes/layout-hd6e.js";import Layoutlhuo8z7it6ug from "/__app/routes/layout-63re.js";import Pagep7t86fuziuhs from "/__app/routes/page-u97z.js"; customElements.define("fw-layout-ftzzt967gi67", Layoutftzzt967gi67);customElements.define("fw-layout-lhuo8z7it6ug", Layoutlhuo8z7it6ug);customElements.define("fw-page-p7t86fuziuhs", Pagep7t86fuziuhs);',
    {
      pageData: {more: 'from sub layout', other: 'data from layout', some: 'subPageData', else: 'something from sub page'},
      pageParams: {}
    },
    [],
    'https://domain.com/otherRoute'
  );
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{"some":"subPageData","other":"data from layout","more":"from sub layout","else":"something from sub page"},"pageParams":{}};
    </script>
    <script type="module">
        import Layoutftzzt967gi67 from "/__app/routes/layout-hd6e.js";import Layoutlhuo8z7it6ug from "/__app/routes/layout-63re.js";import Pagep7t86fuziuhs from "/__app/routes/page-u97z.js";
        customElements.define("fw-layout-ftzzt967gi67", Layoutftzzt967gi67);customElements.define("fw-layout-lhuo8z7it6ug", Layoutlhuo8z7it6ug);customElements.define("fw-page-p7t86fuziuhs", Pagep7t86fuziuhs);
    </script>
</body>
</html>`);
});

test('serve rendered html param sub route with layout, sub layout and data', async () => {
  const mockRouteStack: RoutePart[] = [
    {
      id: '',
      routeId: '',
      type: 'path',
      page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
      layout: {path: '/__app/routes/layout-hd6e.js', id: 'ftzzt967gi67'},
      pageServer: {
        data: vi.fn().mockResolvedValue({some: 'pageData', any: 'something from page'})
      },
      layoutServer: {
        data: vi.fn().mockResolvedValue({some: 'layoutData', other: 'data from layout'})
      },
      routes: new Map(),
      groupRoutes: []
    },
    {
      id: 'paramRoute',
      routeId: '/[paramRoute]',
      type: 'param',
      page: {path: '/__app/routes/page-u97z.js', id: 'p7t86fuziuhs'},
      layout: {path: '/__app/routes/layout-63re.js', id: 'lhuo8z7it6ug'},
      pageServer: {
        data: vi.fn().mockResolvedValue({some: 'subPageData', else: 'something from sub page'})
      },
      layoutServer: {
        data: vi.fn().mockResolvedValue({some: 'subLayoutData', more: 'from sub layout'})
      },
      routes: new Map(),
      groupRoutes: []
    }
  ];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/someThing'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {paramRoute: 'someThing'}, {some: 'locals'}, '/[paramRoute]', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(mockRouteStack[0].pageServer!.data).not.toHaveBeenCalled();
  expect(mockRouteStack[0].layoutServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[0].layoutServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {}, params: {paramRoute: 'someThing'}, locals: {some: 'locals'}, routeId: '/[paramRoute]', cookies: mockCookieHandler});
  expect(mockRouteStack[1].layoutServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[1].layoutServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {some: 'layoutData', other: 'data from layout'}, params: {paramRoute: 'someThing'}, locals: {some: 'locals'}, routeId: '/[paramRoute]', cookies: mockCookieHandler});
  expect(mockRouteStack[1].pageServer!.data).toHaveBeenCalledOnce();
  expect(mockRouteStack[1].pageServer!.data).toHaveBeenCalledWith({request: mockRequest, data: {some: 'subLayoutData', other: 'data from layout', more: 'from sub layout'}, params: {paramRoute: 'someThing'}, locals: {some: 'locals'}, routeId: '/[paramRoute]', cookies: mockCookieHandler});
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-layout-ftzzt967gi67><fw-layout-lhuo8z7it6ug><fw-page-p7t86fuziuhs></fw-page-p7t86fuziuhs></fw-layout-lhuo8z7it6ug></fw-layout-ftzzt967gi67>',
    'import Layoutftzzt967gi67 from "/__app/routes/layout-hd6e.js";import Layoutlhuo8z7it6ug from "/__app/routes/layout-63re.js";import Pagep7t86fuziuhs from "/__app/routes/page-u97z.js"; customElements.define("fw-layout-ftzzt967gi67", Layoutftzzt967gi67);customElements.define("fw-layout-lhuo8z7it6ug", Layoutlhuo8z7it6ug);customElements.define("fw-page-p7t86fuziuhs", Pagep7t86fuziuhs);',
    {
      pageData: {more: 'from sub layout', other: 'data from layout', some: 'subPageData', else: 'something from sub page'},
      pageParams: {paramRoute: 'someThing'}
    },
    [],
    'https://domain.com/someThing'
  );
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{"some":"subPageData","other":"data from layout","more":"from sub layout","else":"something from sub page"},"pageParams":{"paramRoute":"someThing"}};
    </script>
    <script type="module">
        import Layoutftzzt967gi67 from "/__app/routes/layout-hd6e.js";import Layoutlhuo8z7it6ug from "/__app/routes/layout-63re.js";import Pagep7t86fuziuhs from "/__app/routes/page-u97z.js";
        customElements.define("fw-layout-ftzzt967gi67", Layoutftzzt967gi67);customElements.define("fw-layout-lhuo8z7it6ug", Layoutlhuo8z7it6ug);customElements.define("fw-page-p7t86fuziuhs", Pagep7t86fuziuhs);
    </script>
</body>
</html>`);
});

test('return 500 if no page endpoint specified', async () => {
  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeFalsy();
  expect(ssr).not.toHaveBeenCalled();
  expect(mockResponse.writeHead).not.toHaveBeenCalled();
  expect(mockResponse.end).not.toHaveBeenCalled();
});

test('serve rendered html route with root files', async () => {
  const mockGetLocaleStrings = vi.fn().mockReturnValue({some: 'string'});
  vi.resetModules();
  vi.doMock('./rootFiles', () => ({
    rootCss: 'some root CSS',
    appCss: 'some app CSS path',
    getLocaleStrings: mockGetLocaleStrings,
    setupClient: 'some setup client path'
  }));
  const {printPage} = await import('./servePageEndpoint');

  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {headers: {referer: 'https://domain.com/'}};
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {},
      pageParams: {},
      locales: {
        some: "string",
      },
      prependStyles: '@import url("some app CSS path");'
    },
    [],
    'https://domain.com/'
  );
  expect(mockGetLocaleStrings).toHaveBeenCalledOnce();
  expect(mockGetLocaleStrings).toHaveBeenCalledWith([]);
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
<style>some root CSS</style>
<link rel="stylesheet" href="some app CSS path">
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{},"pageParams":{},"prependStyles":"@import url(\\"some app CSS path\\");","locales":{"some":"string"}};
    </script>
    <script type="module">
        import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html route with root files with accept-language with origin without referer', async () => {
  const mockGetLocaleStrings = vi.fn().mockReturnValue({some: 'string'});
  vi.resetModules();
  vi.doMock('./rootFiles', () => ({
    rootCss: 'some root CSS',
    appCss: 'some app CSS path',
    getLocaleStrings: mockGetLocaleStrings,
    setupClient: 'some setup client path'
  }));
  const {printPage} = await import('./servePageEndpoint');

  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {
    headers: {
      origin: 'domain.com',
      'accept-language': 'de-DE, en-US'
    },
    url: '/'
  };
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {},
      pageParams: {},
      locales: {
        some: "string",
      },
      prependStyles: '@import url("some app CSS path");'
    },
    ['de-DE', 'en-US'],
    'https://domain.com/'
  );
  expect(mockGetLocaleStrings).toHaveBeenCalledOnce();
  expect(mockGetLocaleStrings).toHaveBeenCalledWith('de-DE, en-US');
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
<style>some root CSS</style>
<link rel="stylesheet" href="some app CSS path">
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{},"pageParams":{},"prependStyles":"@import url(\\"some app CSS path\\");","locales":{"some":"string"}};
    </script>
    <script type="module">
        import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html route with root files with host without referer or origin', async () => {
  const mockGetLocaleStrings = vi.fn().mockReturnValue({some: 'string'});
  vi.resetModules();
  vi.doMock('./rootFiles', () => ({
    rootCss: 'some root CSS',
    appCss: 'some app CSS path',
    getLocaleStrings: mockGetLocaleStrings,
    setupClient: 'some setup client path'
  }));
  const {printPage} = await import('./servePageEndpoint');

  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {
    headers: {
      host: 'domain.com',
    },
    url: '/'
  };
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {},
      pageParams: {},
      locales: {
        some: "string",
      },
      prependStyles: '@import url("some app CSS path");'
    },
    [],
    'https://domain.com/'
  );
  expect(mockGetLocaleStrings).toHaveBeenCalledOnce();
  expect(mockGetLocaleStrings).toHaveBeenCalledWith([]);
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
<style>some root CSS</style>
<link rel="stylesheet" href="some app CSS path">
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{},"pageParams":{},"prependStyles":"@import url(\\"some app CSS path\\");","locales":{"some":"string"}};
    </script>
    <script type="module">
        import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});

test('serve rendered html route with root files without referer or origin or host', async () => {
  const mockGetLocaleStrings = vi.fn().mockReturnValue({some: 'string'});
  vi.resetModules();
  vi.doMock('./rootFiles', () => ({
    rootCss: 'some root CSS',
    appCss: 'some app CSS path',
    getLocaleStrings: mockGetLocaleStrings,
    setupClient: 'some setup client path'
  }));
  const {printPage} = await import('./servePageEndpoint');

  const mockRouteStack: RoutePart[] = [{
    id: '',
    routeId: '',
    type: 'path',
    page: {path: '/__app/routes/page-asdf.js', id: 'kvzo789t6i7f'},
    routes: new Map(),
    groupRoutes: []
  }];
  // @ts-ignore
  const mockRequest: IncomingMessage = {
    headers: {},
    url: '/'
  };
  // @ts-ignore
  const mockResponse: Parameters<RequestListener>[1] = {writeHead: vi.fn(), end: vi.fn()};
  const mockCookieHandler: CookieHandler = {get: vi.fn(), set: vi.fn()};

  const result = await printPage(mockRequest, mockResponse, mockRouteStack, {}, {}, '', mockCookieHandler);

  expect(result).toBeTruthy();
  expect(ssr).toHaveBeenCalledOnce();
  expect(ssr).toHaveBeenCalledWith(
    '<fw-page-kvzo789t6i7f></fw-page-kvzo789t6i7f>',
    'import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js"; customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);',
    {
      pageData: {},
      pageParams: {},
      locales: {
        some: "string",
      },
      prependStyles: '@import url("some app CSS path");'
    },
    [],
    'https://localhost/'
  );
  expect(mockGetLocaleStrings).toHaveBeenCalledOnce();
  expect(mockGetLocaleStrings).toHaveBeenCalledWith([]);
  expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/html'});
  expect(mockResponse.end).toHaveBeenCalledWith(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
<style>some root CSS</style>
<link rel="stylesheet" href="some app CSS path">
</head>
<body>
    server-side rendered html
    <script type="module">
        window.__duduk = {"pageData":{},"pageParams":{},"prependStyles":"@import url(\\"some app CSS path\\");","locales":{"some":"string"}};
    </script>
    <script type="module">
        import "some setup client path";import Pagekvzo789t6i7f from "/__app/routes/page-asdf.js";
        customElements.define("fw-page-kvzo789t6i7f", Pagekvzo789t6i7f);
    </script>
</body>
</html>`);
});
