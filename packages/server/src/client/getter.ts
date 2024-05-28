export function getData<T = object>(): T {
  return window.__duduk?.pageData ?? {} as T;
}

export function getParams(): Record<string, string> {
  return window.__duduk?.pageParams ?? {};
}
