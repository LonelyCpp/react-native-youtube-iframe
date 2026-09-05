const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HARNESS_DIR = path.resolve(__dirname);
const PORT = process.env.PORT || 8123;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Serve the LIVE source iframe (always current) as iframe_v2.html and iframe.html
  if (/^\/(iframe(_v\d+)?\.html)$/.test(urlPath)) {
    res.writeHead(200, {'Content-Type': MIME['.html']});
    return res.end(fs.readFileSync(path.join(ROOT, 'iframe.html')));
  }

  // Serve harness files from test-harness/
  let file = path.join(HARNESS_DIR, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(HARNESS_DIR, 'index.html');
  }

  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
  res.end(fs.readFileSync(file));
});

server.listen(PORT, () => {
  console.log(`Web harness serving on http://localhost:${PORT}`);
  console.log(`  harness:  http://localhost:${PORT}/`);
  console.log(`  iframe:   http://localhost:${PORT}/iframe_v2.html`);
});
