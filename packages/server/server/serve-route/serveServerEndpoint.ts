import type {IncomingMessage, RequestListener} from "node:http";
import type {RoutePart} from "./models.js";

type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function executeServer(req: IncomingMessage, res: Parameters<RequestListener>[1], stack: RoutePart[], params: Record<string, string>): Promise<void> {
  const method = (req.method ?? 'GET') as Methods;

  let cumulatedData = {};
  for (const routePart of stack) {
    if (routePart.layoutServer !== undefined && method in routePart.layoutServer && routePart.layoutServer[method] !== undefined) {
      const httpHandler = routePart.layoutServer[method];
      cumulatedData = {...cumulatedData, ...await httpHandler({request: req, data: cumulatedData})};
    }
  }

  const lastPart = stack[stack.length - 1];
  if (lastPart.pageServer === undefined || !(method in lastPart.pageServer) || lastPart.pageServer[method] === undefined) {
    res.writeHead(500);
    res.end('500 Internal Server Error');
    return;
  }
  const httpHandler = lastPart.pageServer[method];
  await httpHandler({request: req, response: res, data: cumulatedData, params});
}
