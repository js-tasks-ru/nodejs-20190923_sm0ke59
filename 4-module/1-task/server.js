const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const dir = path.join(__dirname, 'files')

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end(JSON.stringify({
          isError: true,
          errorMessage: 'Not supported'
        }))
      }

      if (fs.readdirSync(dir).some(fileName => fileName.toUpperCase() === pathname.toUpperCase())) {
     fs.createReadStream(filepath).pipe(res)
      } else {
        res.statusCode = 404;
          res.end(JSON.stringify({
          isError: true,
          errorMessage: 'No file'
        }))
      }      
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
