import type {Middlewares} from "./models";
import fsPromise from "node:fs/promises";
import fs from 'node:fs';

export const rootCss: string | undefined = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('root-') && itemName.endsWith('.css')) {
      return await fsPromise.readFile(`${folder}/${itemName}`, {encoding: 'utf8'});
    }
  }
  return undefined;
})();

export const appCss: string | undefined = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('app-') && itemName.endsWith('.css')) {
      return `/__app/${itemName}`;
    }
  }
  return undefined;
})();

export const setupClient: string | undefined = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('setupClient-') && itemName.endsWith('.js')) {
      return `/__app/${itemName}`;
    }
  }
  return undefined;
})();

export const setupServer = await (async function () {
  const folder = `${import.meta.dirname}/__app`;
  const items = await fsPromise.readdir(folder);
  for (const itemName of items) {
    if (itemName.startsWith('setupServer-') && itemName.endsWith('.js')) {
      const setupServer: {middlewares: Middlewares | undefined} = await import(`${folder}/${itemName}`);
      return setupServer;
    }
  }
  return undefined;
})();

export const getLocaleStrings = await (async function () {
  const folder = `${import.meta.dirname}/__app/_.._/inject`;
  if (fs.existsSync(folder)) {
    const items = await fsPromise.readdir(folder);
    for (const itemName of items) {
      if (itemName.startsWith('locales-') && itemName.endsWith('.js')) {
        const localesFiles: typeof import('../../inject/locales') = await import(`${folder}/${itemName}`);
        return localesFiles.getLocaleStrings;
      }
    }
  }
  return undefined;
})();
