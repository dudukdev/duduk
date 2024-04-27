import type {IncomingMessage, ServerResponse} from "node:http";

export type PageServerDataFunction = (params: { request: IncomingMessage }) => Promise<object>;
export type PageServerHttpFunction<TData = object> = (params: { request: IncomingMessage; response: ServerResponse; data: TData; params: Record<string, string> }) => Promise<void>;
export type LayoutServerDataFunction = (params: { request: IncomingMessage }) => Promise<object>;
export type LayoutServerHttpFunction<TData = object> = (params: { request: IncomingMessage; data: TData }) => Promise<object>;

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
