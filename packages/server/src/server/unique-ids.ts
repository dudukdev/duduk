import {createHash} from "node:crypto";

const characters = '0123456789abcdefghijklmnopqrstuv';
const generatedRandomIds: string[] = [];

export function uniqueRandomId(): string {
  let generatedId = '';
  do {
    for (let i = 0; i < 5; i++) {
      const id = Math.floor(Math.random() * characters.length);
      generatedId += characters[id];
    }
  } while (generatedRandomIds.includes(generatedId));
  return generatedId;
}

export function uniqueIdFromString(value: string): string {
  const hash = createHash('md5').update(value);
  return hash.digest("hex").toLowerCase();
}
