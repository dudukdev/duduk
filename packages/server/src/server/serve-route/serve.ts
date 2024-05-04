import type {IncomingMessage, RequestListener} from "node:http";
import type {RoutePart} from "./models";
import {matchAcceptHeader} from "@duduk/content-negotiation";
import {getRoutes} from "./parseRoutes";
import {printPage} from "./servePageEndpoint";
import {executeServer} from "./serveServerEndpoint";
import fsPromise from "node:fs/promises";

const rootRoute = await getRoutes();

await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('setupServer-') && itemName.endsWith('.js')) {
      await import(`${folder}/${itemName}`);
    }
  }
})();

export async function serveRoute(req: IncomingMessage, res: Parameters<RequestListener>[1]): Promise<boolean> {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const requestedMethod = req.method ?? 'GET';
  const pathParts = url.pathname.split('/');
  pathParts.shift();
  if (pathParts[pathParts.length - 1] === '') {
    pathParts.pop();
  }

  const stackResult = getStack(pathParts, rootRoute, [], {});

  if (stackResult === undefined) {
    return false;
  }

  const {stack, params} = stackResult;

  const accept = req.headers.accept ?? '';

  switch (matchAcceptHeader(accept, ['text/html', 'application/json'])) {
    case 'text/html':
      if (requestedMethod === 'GET') {
        await printPage(req, res, stack, params);
      } else {
        res.writeHead(405);
        res.end();
      }
      break;
    case 'application/json':
      if (requestedMethod in (stack[stack.length - 1].pageServer ?? {})) {
        await executeServer(req, res, stack, params);
      } else {
        res.writeHead(405);
        res.end();
      }
      break;
    default:
      res.writeHead(406);
      res.end();
  }

  return true;
}

function getStack(pathParts: string[], part: RoutePart, stack: RoutePart[], params: Record<string, string>): { stack: RoutePart[]; params: Record<string, string> } | undefined {
  if (pathParts.length > 0) {
    const nextPathPart = pathParts.shift() ?? '';
    const nextRoutePart = part.routes.get(nextPathPart) ?? part.paramRoute;
    if (nextRoutePart === undefined) {
      return undefined;
    }

    if (nextRoutePart.parameter) {
      params[nextRoutePart.id] = nextPathPart;
    }

    if (part.layout !== undefined) {
      stack.push(part);
    }
    return getStack(pathParts, nextRoutePart, stack, params);
  } else {
    if (part.page === undefined && part.pageServer === undefined) {
      return undefined;
    } else {
      stack.push(part);
      return {stack, params};
    }
  }
}
