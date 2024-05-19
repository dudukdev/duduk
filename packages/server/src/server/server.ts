import {type RequestListener, createServer} from "node:http";
import {serveRoute} from "./serve-route/serveRoute";
import {serveFile} from "./serve-file/serveFile";

const requestListener: RequestListener = async function (req, res) {
  const fileServed = serveFile(req, res);
  if (fileServed) {
    return;
  }

  const routeServed = await serveRoute(req, res);
  if (routeServed) {
    return;
  }

  res.writeHead(404);
  res.end();
};

const server = createServer(requestListener);

const host = process.env.HOST ?? '127.0.0.1';
const port = process.env.PORT ? Number(process.env.PORT) : 8000;

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
