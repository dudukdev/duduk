import {createHash} from "node:crypto";

export function uniqueIdFromString(value: string): string {
  const hash = createHash('md5').update(value);
  return hash.digest('hex').toLowerCase();
}
