const http = require('http');
const PORT = process.env.PORT || 8000;
const fs = require('fs');
const qs = require('querystring');

const server = http.createServer((req, res) => {
  console.log('req.method', req.method);
  console.log('req.headers', req.headers);
  console.log('req.url', req.url);

  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.write('/');
          res.end();
        }
        else {
          res.writeHead(200, { 'content-type': 'text/html' });
          res.write(data);
          res.end();
        }
      });
    }
    else if (req.url === '/css/styles.css') {
      fs.readFile('./public/css/styles.css', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.write('ERROR');
          res.end();
        }
        else {
          res.writeHead(200, { 'content-type': 'text/css' });
          res.write(data);
          res.end();
        }
      });
    }
    else if (`./public/${req.url}`) {
      fs.readFile(`./public/${req.url}`, 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.write('ERROR');
          res.end();
        }
        else {
          res.writeHead(200, { 'content-type': 'text/html' });
          res.write(data);
          res.end();
        }
      });
    }
    else if (req.url === './public/error.html') {
      fs.readFile('./public/error.html', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.write('ERROR');
          res.end();
        }
        else {
          res.writeHead(200, { 'content-type': 'text/html' });
          res.write(data);
          res.end();
        }
      });
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// const http = require('http');
// const PORT = process.env.PORT || 8000;
// // console.log('CL PORT =', PORT);
// const fs = require('fs');

// const server = http.createServer((req, res) => {
//   // console.log('CL req.method =', req.method);
//   // console.log('CL req.headers =', req.headers);
//   // console.log('CL req.url =', req.url);

//   if (req.method === 'GET') {
//     if (req.url === '/') {
//       fs.readFile('./public/index.html', 'utf-8', (err, data) => {
//         if (err) throw err;
//         res.writeHead(200, { 'content-type': 'text/html'});
//         res.write(data);
//         res.end();
//       });
//     }
//     if (req.url === '/css/styles.css') {
//       fs.readFile('./public/css/styles.css', (err, data) => {
//         if (err) throw err;
//         res.writeHead(200, { 'content-type': 'text/css)' });
//         res.write(data);
//         res.end();
//       })
//     }
//     if (req.url === `./public/${req.url}`) {
//       fs.readFile(`./public/${req.url}`, 'utf-8', (err, data) => {
//         if (err) throw err;
//         res.writeHead(200, { 'content-type': 'text/html'});
//         res.write(data);
//         res.end();
//       })
//     }
//     if (req.url === './public/err.html') {
//       fs.readFile('./public/err.html', 'utf-8', (err, data) => {
//         if (err) throw err;
//         res.writeHead(200, { 'content-type': 'text/html'});
//         res.write(data);
//         res.end();
//       })
//     }
//   }
// });

// server.listen(PORT, () => {
//   console.log(`CL Server listening on = ${PORT} `);
// });

