import type {IncomingMessage, ServerResponse} from "node:http";

declare global {
  namespace App {
    interface Locals {
      [key: string]: any;
    }
  }
}

export type PageServerDataFunction<TData = object> = (params: { request: IncomingMessage; data: TData; locals: App.Locals }) => Promise<object>;
export type PageServerHttpFunction<TData = object> = (params: { request: IncomingMessage; response: ServerResponse; data: TData; params: Record<string, string>; locals: App.Locals }) => Promise<void>;
export type LayoutServerDataFunction<TData = object> = (params: { request: IncomingMessage; data: TData; locals: App.Locals }) => Promise<object>;
export type LayoutServerHttpFunction<TData = object> = (params: { request: IncomingMessage; data: TData; locals: App.Locals }) => Promise<object>;

export type MiddlewareEvent = { request: IncomingMessage; params: Record<string, string>; locals: App.Locals };
export type ResolveFunction = (event: MiddlewareEvent) => Promise<ServerResponse>;
export type Middleware = (params: { event: MiddlewareEvent; resolve: ResolveFunction; response: ServerResponse }) => Promise<ServerResponse>;
export type Middlewares = Middleware[];

export interface RoutePart {
  id: string;
  parameter: boolean;
  page?: {
    path: string;
    id: string;
  };
  pageServer?: {
    data?: PageServerDataFunction;
    GET?: PageServerHttpFunction;
    POST?: PageServerHttpFunction;
    PUT?: PageServerHttpFunction;
    PATCH?: PageServerHttpFunction;
    DELETE?: PageServerHttpFunction;
  };
  layout?: {
    path: string;
    id: string;
  };
  layoutServer?: {
    data?: LayoutServerDataFunction;
    GET?: LayoutServerHttpFunction;
    POST?: LayoutServerHttpFunction;
    PUT?: LayoutServerHttpFunction;
    PATCH?: LayoutServerHttpFunction;
    DELETE?: LayoutServerHttpFunction;
  };
  routes: Map<string, RoutePart>;
  paramRoute?: RoutePart;
}
