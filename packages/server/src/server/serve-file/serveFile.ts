import type {RequestListener} from "node:http";
import fs from "node:fs";
import mime from "mime";
import path from "node:path";

export function serveFile(req: Parameters<RequestListener>[0], res: Parameters<RequestListener>[1]): boolean {
  const file = path.normalize(`${import.meta.dirname}${req.url}`);

  if (!file.startsWith(import.meta.dirname) || !fs.existsSync(file)) {
    return false;
  }

  const stat = fs.statSync(file);

  if (!stat.isFile()) {
    return false;
  } else if (req.method !== 'GET') {
    res.writeHead(405);
    res.end();
    return true;
  }

  res.writeHead(200, {
    'Content-Type': mime.getType(file) ?? undefined,
    'Content-Length': `${stat.size}`
  });
  const readStream = fs.createReadStream(file);
  readStream.pipe(res);

  return true;
}
