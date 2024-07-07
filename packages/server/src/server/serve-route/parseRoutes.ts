import type {RoutePart} from "./models";
import fsPromise from "node:fs/promises";
import path from "node:path";
import {uniqueIdFromString} from "../unique-ids";

export async function getRoutes(): Promise<RoutePart> {
  const routes: RoutePart = {
    id: '',
    routeId: '',
    type: 'path',
    routes: new Map(),
    groupRoutes: []
  }

  await readFolder(`${import.meta.dirname}/__app/routes`, routes);
  return routes;
}

async function readFolder(folder: string, routePart: RoutePart): Promise<void> {
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    const itemPath = path.join(folder, itemName);
    const item = await fsPromise.lstat(itemPath);
    if (item.isFile()) {
      const localItemPath = `/${path.relative(import.meta.dirname, itemPath)}`;
      if (itemName.startsWith('page-') && itemName.endsWith('.js') && routePart.type !== 'group') {
        routePart.page = {
          path: localItemPath,
          id: uniqueIdFromString(localItemPath)
        };
      } else if (itemName.startsWith('pageServer-') && itemName.endsWith('.js') && routePart.type !== 'group') {
        routePart.pageServer ??= {};
        const pageServer = await import(itemPath);
        if ('data' in pageServer && typeof pageServer.data === 'function') {
          routePart.pageServer.data = pageServer.data;
        }
        if ('GET' in pageServer && typeof pageServer.GET === 'function') {
          routePart.pageServer.GET = pageServer.GET;
        }
        if ('POST' in pageServer && typeof pageServer.POST === 'function') {
          routePart.pageServer.POST = pageServer.POST;
        }
        if ('PUT' in pageServer && typeof pageServer.PUT === 'function') {
          routePart.pageServer.PUT = pageServer.PUT;
        }
        if ('PATCH' in pageServer && typeof pageServer.PATCH === 'function') {
          routePart.pageServer.PATCH = pageServer.PATCH;
        }
        if ('DELETE' in pageServer && typeof pageServer.DELETE === 'function') {
          routePart.pageServer.DELETE = pageServer.DELETE;
        }
      } else if (itemName.startsWith('layout-') && itemName.endsWith('.js')) {
        routePart.layout = {
          path: localItemPath,
          id: uniqueIdFromString(localItemPath)
        };
      } else if (itemName.startsWith('layoutServer-') && itemName.endsWith('.js')) {
        routePart.layoutServer ??= {};
        const layoutServer = await import(itemPath);
        if ('data' in layoutServer && typeof layoutServer.data === 'function') {
          routePart.layoutServer.data = layoutServer.data;
        }
        if ('GET' in layoutServer && typeof layoutServer.GET === 'function') {
          routePart.layoutServer.GET = layoutServer.GET;
        }
        if ('POST' in layoutServer && typeof layoutServer.POST === 'function') {
          routePart.layoutServer.POST = layoutServer.POST;
        }
        if ('PUT' in layoutServer && typeof layoutServer.PUT === 'function') {
          routePart.layoutServer.PUT = layoutServer.PUT;
        }
        if ('PATCH' in layoutServer && typeof layoutServer.PATCH === 'function') {
          routePart.layoutServer.PATCH = layoutServer.PATCH;
        }
        if ('DELETE' in layoutServer && typeof layoutServer.DELETE === 'function') {
          routePart.layoutServer.DELETE = layoutServer.DELETE;
        }
      }
    } else if (item.isDirectory()) {
      let newRoutePart: RoutePart;
      if (itemName[0] === '[' && itemName[itemName.length - 1] === ']' && itemName.length > 2) {
        const paramName = itemName.substring(1, itemName.length - 1);
        newRoutePart = {
          id: paramName,
          routeId: `${routePart.routeId}/${itemName}`,
          type: 'param',
          routes: new Map(),
          groupRoutes: []
        };
        routePart.paramRoute = newRoutePart;
      } else if (itemName[0] === '(' && itemName[itemName.length - 1] === ')' && itemName.length > 2) {
        const groupName = itemName.substring(1, itemName.length - 1);
        newRoutePart = {
          id: groupName,
          routeId: `${routePart.routeId}/${itemName}`,
          type: 'group',
          routes: new Map(),
          groupRoutes: []
        };
        routePart.groupRoutes.push(newRoutePart);
      } else {
        newRoutePart = {
          id: itemName,
          routeId: `${routePart.routeId}/${itemName}`,
          type: 'path',
          routes: new Map(),
          groupRoutes: []
        };
        routePart.routes.set(itemName, newRoutePart);
      }
      await readFolder(itemPath, newRoutePart);
    }
  }
}
