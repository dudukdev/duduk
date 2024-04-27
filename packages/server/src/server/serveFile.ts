import type {RequestListener} from "node:http";
import fs from "node:fs";
import mime from "mime";

export function serveFile(req: Parameters<RequestListener>[0], res: Parameters<RequestListener>[1]): boolean {
  const file = `${import.meta.dirname}${req.url}`;

  if (!fs.existsSync(file)) {
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
    'Content-Type': mime.getType(file),
    'Content-Length': stat.size
  });
  const readStream = fs.createReadStream(file);
  readStream.pipe(res);

  return true;
}
