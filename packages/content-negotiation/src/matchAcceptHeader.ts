import {parseHeader} from "./parse";
import {matchMimeType, splitMimeFromParams} from "./matchMimeType";

export function matchAcceptHeader(acceptHeader: string, match: string[]): string | undefined {
  const entries = parseHeader(acceptHeader);
  entries.sort((a, b) => {
    if (a.weight === b.weight) {
      if (a.value === b.value) {
        if (Object.keys(a.parameters).length === 0 && Object.keys(b.parameters).length > 0) {
          return 1;
        } else if (Object.keys(a.parameters).length > 0 && Object.keys(b.parameters).length === 0) {
          return -1;
        }
        return 0;
      }

      return compareMatch(a.value, b.value);
    } else {
      return 0;
    }
  });

  for (const entry of entries) {
    const matches: string[] = [];
    for (const check of match) {
      if (matchMimeType(entry.raw, check, false)) {
        matches.push(check);
      }
    }
    if (matches.length === 0) {
      continue;
    }
    matches.sort(compareMatch);
    return matches[0];
  }

  return undefined;
}

function compareMatch(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  const aSplit = splitMimeFromParams(a);
  const bSplit = splitMimeFromParams(b);

  const [aType, aSubtype] = aSplit.mime.split('/');
  const [bType, bSubtype] = bSplit.mime.split('/');
  if (aType === bType && aSubtype === bSubtype) {
    if (aSplit.params === undefined && bSplit.params !== undefined) {
      return 1;
    } else if (aSplit.params !== undefined && bSplit.params === undefined) {
      return -1;
    }
    return 0;
  }
  if (aType !== bType) {
    if (aType === '*') {
      return 1;
    } else if (bType === '*') {
      return -1;
    }
    return 0;
  }
  if (aSubtype !== bSubtype) {
    if (aSubtype === '*') {
      return 1;
    } else if (bSubtype === '*') {
      return -1;
    }
  }
  return 0;
}
