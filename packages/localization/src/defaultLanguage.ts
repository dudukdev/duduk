export function defaultLanguages(): readonly string[] | string[] {
  if (typeof navigator !== 'undefined') {
    return navigator.languages ?? [];
  }
  return [];
}
