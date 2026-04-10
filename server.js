const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const ROOT = path.join(__dirname, 'src');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.mp3':  'audio/mpeg',
  '.ogg':  'audio/ogg',
  '.wav':  'audio/wav',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

function getLocalIPs() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const iface of Object.values(nets)) {
    for (const cfg of iface) {
      if (cfg.family === 'IPv4' && !cfg.internal) results.push(cfg.address);
    }
  }
  return results;
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(ROOT))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(resolved, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(resolved).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║        ☁  云传奇 · 局域网服务器      ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║  本机访问:  http://localhost:${PORT}     ║`);
  for (const ip of ips) {
    const padded = `http://${ip}:${PORT}`.padEnd(25);
    console.log(`  ║  局域网:    ${padded}║`);
  }
  console.log('  ╠══════════════════════════════════════╣');
  console.log('  ║  手机/平板扫同一WiFi即可访问局域网地址  ║');
  console.log('  ║  按 Ctrl+C 停止服务器                 ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
