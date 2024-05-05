import * as esbuild from 'esbuild';
import fs from "node:fs";
import path from "node:path";
import type {BuildOptions} from "esbuild";

export async function build(watch: boolean): Promise<void> {
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

  const routesBuildOptions: BuildOptions = {
    entryPoints,
    entryNames: '[dir]/[name]-[hash]',
    nodePaths: ['node_modules/@duduk/server/dist'],
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
  };
  const serverBuildOptions: BuildOptions = {
    entryPoints: ['node_modules/@duduk/server/dist/server/index.mjs'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'esm',
    external: ['jsdom', 'mime']
  };

  if (watch) {
    esbuild.context(routesBuildOptions).then(async (context) => {
      await context.watch();
    })

    esbuild.context(serverBuildOptions).then(async (context) => {
      await context.watch();
    });

    console.log('...watching');
  } else {
    await esbuild.build(routesBuildOptions);
    await esbuild.build(serverBuildOptions);
  }

}
