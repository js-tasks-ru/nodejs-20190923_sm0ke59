
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream  = require('./LimitSizeStream')

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const dir = path.join(__dirname, 'files');
  let data = '';


  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end(JSON.stringify({
          isError: true,
          errorMessage: 'Not supported'
        }))
      }
      const limitedStream = new LimitSizeStream({ limit: 1048576 });
      const outStream = fs.createWriteStream(filepath, {flags:'wx+'});
      
      req.pipe(limitedStream).pipe(outStream)

      req
      .on('close', () => {
        if (!req.complete) {
          outStream.destroy();
          fs.unlinkSync(filepath);
        }
      })
      .on('error', (err) => {
        res.statusCode = 500; 
        res.end(JSON.stringify({
          isError: true,
          errorMessage: 'Somting went wrong',
          code: res.statusCode
        }))
      });
      
      limitedStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(JSON.stringify({
            isError: true,
            errorMessage: 'File is very big',
            code: res.statusCode
          }))
        } else {
          res.statusCode = 500; 
          res.end(JSON.stringify({
            isError: true,
            errorMessage: 'Somting went wrong',
            code: res.statusCode
          }))
        }
      })

        outStream.on('error', (err) => {
  
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end(JSON.stringify({
              isError: true,
              errorMessage: 'File alredy exist',
              code: res.statusCode
            }))
          }
      })
  
      outStream .on('close', () => {
        res.statusCode = 201;
        res.end(
          JSON.stringify({
          isError: false,
          errorMessage: 'Wtite File SUCCESS'
        }))})
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
