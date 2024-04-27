export function getData<T = object>(): T | undefined {
  return window.__app?.pageData ?? {} as T;
}

export function getParams(): Record<string, string> {
  return window.__app.pageParams;
}
