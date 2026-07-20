const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(process.cwd(), reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.writeHead(200, {'Content-Type': type});
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Server error');
  }
}).listen(port, () => console.log(`Static server running at http://localhost:${port}`));
