// Local preview: node serve.mjs  →  http://localhost:4321
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http
  .createServer(async (req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
    if (!path || path.endsWith("/") || path.endsWith("\\")) path += "index.html";
    try {
      const body = await readFile(join(root, path));
      res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(4321, () => console.log("http://localhost:4321"));
