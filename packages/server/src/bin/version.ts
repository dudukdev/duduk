import path from "node:path";
import fsPromise from "node:fs/promises";

export async function printVersion(): Promise<void> {
  console.log(await getVersion());
}

export async function getVersion(): Promise<string> {
  const packageJson = path.normalize(`${import.meta.dirname}/../../package.json`);
  const content = JSON.parse(await fsPromise.readFile(packageJson, {encoding: 'utf8'}));
  return `v${content.version}`;
}
