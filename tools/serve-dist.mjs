// Foreground static server for dist/ (Astro 7's `preview` detaches in non-TTY shells).
// Mirrors GitHub Pages: directory index files, and dist/404.html with a 404 status.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.argv[2] ?? 4321);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain', '.pdf': 'application/pdf',
};

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(root, clean);
  if (!full.startsWith(root)) return null;
  if (existsSync(full) && statSync(full).isFile()) return full;
  const index = path.join(full, 'index.html');
  return existsSync(index) ? index : null;
}

createServer((req, res) => {
  const file = resolveFile(req.url ?? '/');
  const status = file ? 200 : 404;
  const target = file ?? path.join(root, '404.html');
  res.writeHead(status, { 'content-type': types[path.extname(target)] ?? 'application/octet-stream' });
  res.end(existsSync(target) ? readFileSync(target) : 'Not found');
}).listen(port, () => console.log(`serving dist on http://localhost:${port}`));
