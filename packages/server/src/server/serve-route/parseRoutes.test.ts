import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {uniqueIdFromString} from "../unique-ids";
import fsPromise from "node:fs/promises";
import {getRoutes} from "./parseRoutes";

vi.mock('../unique-ids', () => ({
  uniqueIdFromString: vi.fn()
}));
vi.mock('node:fs/promises', () => ({
  default: {
    readdir: vi.fn(),
    lstat: vi.fn()
  }
}));
vi.mock(`${import.meta.dirname}/__app/routes/pageServer-qwertz.js`, () => ({
  data: () => {},
  GET: () => {},
  POST: () => {},
  PUT: () => {},
  PATCH: () => {},
  DELETE: () => {}
}));
vi.mock(`${import.meta.dirname}/__app/routes/layoutServer-4h97.js`, () => ({
  data: () => {},
  GET: () => {},
  POST: () => {},
  PUT: () => {},
  PATCH: () => {},
  DELETE: () => {}
}));
vi.mock(`${import.meta.dirname}/__app/routes/otherRoute/pageServer-l37d.js`, () => ({
  data: {},
  GET: {},
  POST: {},
  PUT: {},
  PATCH: {},
  DELETE: {}
}));
vi.mock(`${import.meta.dirname}/__app/routes/otherRoute/layoutServer-sh45.js`, () => ({
  data: () => {},
  GET: () => {},
  POST: () => {},
  PUT: {},
  PATCH: {},
  DELETE: {}
}));
vi.mock(`${import.meta.dirname}/__app/routes/otherRoute/(myGroup)/pageServer-k8d6.js`, () => ({}));
vi.mock(`${import.meta.dirname}/__app/routes/otherRoute/(myGroup)/layoutServer-lo97.js`, () => ({}));
vi.mock(`${import.meta.dirname}/__app/routes/otherRoute/(myGroup)/[someParam]/pageServer-al47.js`, () => ({}));
vi.mock(`${import.meta.dirname}/__app/routes/otherRoute/(myGroup)/[someParam]/layoutServer-83t6.js`, () => ({}));

beforeEach(() => {
  vi.mocked(uniqueIdFromString).mockReturnValue('uniqueIdFromString');
  // @ts-ignore
  vi.mocked(fsPromise.readdir).mockImplementation(async (path) => {
    if ((path as string).endsWith('/__app/routes')) {
      return [
        'page-asdf.js',
        'pageServer-qwertz.js',
        'layout-hd6e.js',
        'layoutServer-4h97.js',
        'otherRoute'
      ];
    } else if ((path as string).endsWith('/__app/routes/otherRoute')) {
      return [
        'page-ndu4.js',
        'pageServer-l37d.js',
        'layout-a53f.js',
        'layoutServer-sh45.js',
        '(myGroup)'
      ];
    } else if ((path as string).endsWith('/__app/routes/otherRoute/(myGroup)')) {
      return [
        'page-hd73.js',
        'pageServer-k8d6.js',
        'layout-s24f.js',
        'layoutServer-lo97.js',
        '[someParam]'
      ];
    } else if ((path as string).endsWith('/__app/routes/otherRoute/(myGroup)/[someParam]')) {
      return [
        'page-jd64.js',
        'pageServer-al47.js',
        'layout-shg4.js',
        'layoutServer-83t6.js'
      ];
    }
    return [];
  });
  // @ts-ignore
  vi.mocked(fsPromise.lstat).mockImplementation(async (path) => {
    return {
      isFile: () => (path as string).endsWith('.js'),
      isDirectory: () => !(path as string).endsWith('.js'),
    };
  })
});

afterEach(() => {
  vi.resetAllMocks();
});

test('return routes', async () => {
  const result = await getRoutes();

  const pageServerQwertz = await import(`${import.meta.dirname}/__app/routes/pageServer-qwertz.js`);
  const layoutServer4h97 = await import(`${import.meta.dirname}/__app/routes/layoutServer-4h97.js`);

  expect(result).toEqual({
    id: '',
    routeId: '/',
    type: 'path',
    layout: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/layout-hd6e.js'
    },
    layoutServer: {
      data: layoutServer4h97.data,
      GET: layoutServer4h97.GET,
      POST: layoutServer4h97.POST,
      PUT: layoutServer4h97.PUT,
      PATCH: layoutServer4h97.PATCH,
      DELETE: layoutServer4h97.DELETE,
    },
    page: {
      id: 'uniqueIdFromString',
      path: '/__app/routes/page-asdf.js'
    },
    pageServer: {
      data: pageServerQwertz.data,
      GET: pageServerQwertz.GET,
      POST: pageServerQwertz.POST,
      PUT: pageServerQwertz.PUT,
      PATCH: pageServerQwertz.PATCH,
      DELETE: pageServerQwertz.DELETE,
    },
    routes: new Map([
      [
        'otherRoute',
        {
          id: 'otherRoute',
          routeId: '/otherRoute',
          type: 'path',
          layout: {
            id: 'uniqueIdFromString',
            path: '/__app/routes/otherRoute/layout-a53f.js'
          },
          layoutServer: {
            data: expect.any(Function),
            GET: expect.any(Function),
            POST: expect.any(Function)
          },
          page: {
            id: 'uniqueIdFromString',
            path: '/__app/routes/otherRoute/page-ndu4.js'
          },
          pageServer: {},
          routes: new Map(),
          groupRoutes: [
            {
              id: 'myGroup',
              routeId: '/otherRoute/(myGroup)',
              type: 'group',
              layout: {
                id: 'uniqueIdFromString',
                path: '/__app/routes/otherRoute/(myGroup)/layout-s24f.js'
              },
              layoutServer: {},
              routes: new Map(),
              groupRoutes: [],
              paramRoute: {
                id: 'someParam',
                routeId: '/otherRoute/(myGroup)/[someParam]',
                layout: {
                  id: 'uniqueIdFromString',
                  path: '/__app/routes/otherRoute/(myGroup)/[someParam]/layout-shg4.js'
                },
                layoutServer: {},
                page: {
                  id: 'uniqueIdFromString',
                  path: '/__app/routes/otherRoute/(myGroup)/[someParam]/page-jd64.js'
                },
                pageServer: {},
                type: 'param',
                routes: new Map(),
                groupRoutes: []
              }
            }
          ]
        }
      ]
    ]),
    groupRoutes: []
  });
});
