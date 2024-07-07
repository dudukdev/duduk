import type {IncomingMessage, RequestListener} from "node:http";
import type {RoutePart} from "./models";

type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function executeServer(req: IncomingMessage, res: Parameters<RequestListener>[1], stack: RoutePart[], params: Record<string, string>, locals: App.Locals, routeId: string): Promise<void> {
  const method = (req.method ?? 'GET') as Methods;

  let cumulatedData = {};
  for (const routePart of stack) {
    const httpHandler = routePart.layoutServer?.[method];
    if (httpHandler !== undefined) {
      cumulatedData = {...cumulatedData, ...await httpHandler({request: req, data: cumulatedData, params, locals, routeId})};
    }
  }

  const lastPart = stack[stack.length - 1];
  const httpHandler = lastPart.pageServer![method]!;

  await httpHandler({request: req, response: res, data: cumulatedData, params, locals, routeId});
}
