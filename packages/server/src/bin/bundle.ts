#!/usr/bin/env node
import * as esbuild from 'esbuild';
import fs from "node:fs";
import path from "node:path";

fs.rmSync('dist', {recursive: true, force: true});
fs.mkdirSync('dist/__app', {recursive: true});

const entryPoints: string[] = [];

const readFolder = (folder: string) => {
  const items = fs.readdirSync(folder);
  for (const itemName of items) {
    const itemPath = path.join(folder, itemName);
    const item = fs.lstatSync(itemPath);
    if (item.isFile()) {
      if (['page.ts', 'pageServer.ts', 'layout.ts', 'layoutServer.ts'].includes(itemName)) {
        entryPoints.push(itemPath);
      }
    } else if (item.isDirectory()) {
      readFolder(itemPath);
    }
  }
}

readFolder('src/routes');

[
  'src/app.css',
  'src/root.css',
  'src/setupServer.ts',
  'src/setupClient.ts'
].forEach(file => {
  if (fs.existsSync(file)) {
    entryPoints.push(file);
  }
});

entryPoints.push('inject/locales.mjs');

esbuild.context({
  entryPoints,
  entryNames: '[dir]/[name]-[hash]',
  nodePaths: ['node_modules/@framework/server/dist'],
  outbase: 'src',
  bundle: true,
  outdir: 'dist/__app',
  format: 'esm',
  splitting: true,
  treeShaking: true,
  minify: true,
  loader: {
    '.ttf': 'file',
    '.woff2': 'file',
  },
  external: ['node*'],
  sourcemap: 'linked'
}).then(async (routesContext) => {
  await routesContext.watch();
})

esbuild.context({
  entryPoints: ['node_modules/@framework/server/src/server/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  external: ['jsdom', 'mime']
}).then(async (frameworkContext) => {
  await frameworkContext.watch();
});

console.log('...watching');
