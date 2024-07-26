import type {IncomingMessage, RequestListener} from "node:http";
import type {ResolveFunction, RoutePart} from "./models";
import {matchAcceptHeader} from "@duduk/content-negotiation";
import {getRoutes} from "./parseRoutes";
import {printPage} from "./servePageEndpoint";
import {executeServer} from "./serveServerEndpoint";
import {setupServer} from "./rootFiles";
import {type CookieHandler, createCookieHandler} from "./cookies";
const rootRoute = await getRoutes();

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

  const {stack, params, routeId} = stackResult;
  const cookieHandler = createCookieHandler(req, res);

  await executeMiddlewares(req, res, params, routeId, cookieHandler, async (locals) => {
    const accept = req.headers.accept ?? '';

    const matchHtml = matchAcceptHeader(accept, ['text/html']) !== undefined;
    const matchJson = matchAcceptHeader(accept, ['application/json']) !== undefined;

    if (!matchHtml && !matchJson) {
      res.writeHead(406);
      res.end();
    } else {
      let served = false;
      if ((requestedMethod === 'GET' || requestedMethod === 'POST') && matchHtml) {
        served = await printPage(req, res, stack, params, locals, routeId, cookieHandler);
      }
      if (!served) {
        if (matchJson) {
          if (requestedMethod in (stack[stack.length - 1].pageServer ?? {})) {
            await executeServer(req, res, stack, params, locals, routeId, cookieHandler);
          } else {
            res.writeHead(405);
            res.end();
          }
        } else {
          res.writeHead(405);
          res.end();
        }
      }
    }
  });

  return true;
}

function getStack(pathParts: string[], part: RoutePart, stack: RoutePart[], params: Record<string, string>): { stack: RoutePart[]; params: Record<string, string>; routeId: string } | undefined {
  if (pathParts.length > 0) {
    const nextPathPart = pathParts.shift()!;

    let nextRoutePart = part.routes.get(nextPathPart);
    if (nextRoutePart !== undefined) {
      const newStack = [...stack];
      if (part.layout !== undefined) {
        newStack.push(part);
      }
      const stackResult = getStack([...pathParts], nextRoutePart, newStack, {...params});
      if (stackResult !== undefined) {
        return stackResult;
      }
    }

    for (nextRoutePart of part.groupRoutes) {
      const newStack = [...stack];
      if (part.layout !== undefined) {
        newStack.push(part);
      }
      const stackResult = getStack([nextPathPart, ...pathParts], nextRoutePart, newStack, {...params});
      if (stackResult !== undefined) {
        return stackResult;
      }
    }

    nextRoutePart = part.paramRoute;
    if (nextRoutePart !== undefined) {
      const newStack = [...stack];
      if (part.layout !== undefined) {
        newStack.push(part);
      }
      const newParams = {
        ...params,
        [nextRoutePart.id]: nextPathPart
      }
      const stackResult = getStack([...pathParts], nextRoutePart, newStack, newParams);
      if (stackResult !== undefined) {
        return stackResult;
      }
    }

    return undefined;
  } else {
    if (part.type === 'group' || (part.page === undefined && part.pageServer === undefined)) {
      return undefined;
    } else {
      stack.push(part);
      return {stack, params, routeId: part.routeId};
    }
  }
}

async function executeMiddlewares(request: IncomingMessage, res: Parameters<RequestListener>[1], params: Record<string, string>, routeId: string, cookies: CookieHandler, finishExecution: (locals: App.Locals) => Promise<void>) {
  const middlewares = setupServer?.middlewares;
  if (middlewares !== undefined && middlewares.length > 0) {
    let index = -1;
    const resolveFunction: ResolveFunction = async (event) => {
      index++;
      if (middlewares.length > index) {
        // noinspection ES6RedundantAwait
        return await middlewares[index]({event: {request, params, locals: {...event.locals}, routeId, cookies}, resolve: resolveFunction, response: res});
      } else {
        await finishExecution({...event.locals});
        return res;
      }
    };

    await resolveFunction({request, params, locals: {}, routeId, cookies});
  } else {
    await finishExecution({});
  }
}
