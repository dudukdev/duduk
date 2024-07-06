import type {BuildOptions} from "esbuild";
import * as esbuild from 'esbuild';
import fs from "node:fs";
import path from "node:path";
import fsPromise from "node:fs/promises";

const nodePackages: string[] = ['node:*', 'crypto', 'fs', 'fs/promises', 'http', 'os', 'path', 'vm'];

export async function build(watch: boolean): Promise<void> {
  fs.rmSync('dist', {recursive: true, force: true});
  fs.mkdirSync('dist/__app', {recursive: true});

  const packageJsonFile = await fsPromise.readFile(path.join(process.cwd(), './package.json'), {encoding: 'utf-8'});
  const packageJson: {dependencies?: Record<string, string>} = JSON.parse(packageJsonFile);

  const entryPoints: string[] = [];

  const readFolder = (folder: string) => {
    const items = fs.readdirSync(folder);
    [
      'layout',
      'layoutServer',
      'page',
      'pageServer'
    ].forEach(file => {
      addJsOrTs(entryPoints, path.join(folder, file));
    });
    for (const itemName of items) {
      const itemPath = path.join(folder, itemName);
      const item = fs.lstatSync(itemPath);
      if (item.isDirectory()) {
        readFolder(itemPath);
      }
    }
  }

  readFolder('src/routes');

  [
    'src/app.css',
    'src/root.css'
  ].forEach(file => {
    if (fs.existsSync(file)) {
      entryPoints.push(file);
    }
  });
  addJsOrTs(entryPoints, 'src/setupServer');
  addJsOrTs(entryPoints, 'src/setupClient');

  if (await localizationModuleInstalled()) {
    entryPoints.push('inject/locales.mjs');
  }

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
    external: [...nodePackages, ...Object.keys(packageJson.dependencies ?? {})],
    sourcemap: 'linked'
  };
  const serverBuildOptions: BuildOptions = {
    entryPoints: [{in: 'node_modules/@duduk/server/dist/server/server.mjs', out: 'index'}],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'esm',
    treeShaking: true,
    minify: true,
    packages: 'bundle',
    external: ['jsdom', 'mime', ...Object.keys(packageJson.dependencies ?? {})]
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

function addJsOrTs(entryPoints: string[], filePath: string): void {
  if (fs.existsSync(`${filePath}.js`)) {
    entryPoints.push(`${filePath}.js`);
  } else if (fs.existsSync(`${filePath}.ts`)) {
    entryPoints.push(`${filePath}.ts`);
  }
}

async function localizationModuleInstalled(): Promise<boolean> {
  try {
    await import('@duduk/localization');
    return true;
  } catch {}
  return false;
}
