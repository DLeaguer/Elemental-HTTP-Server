const http = require('http');
const PORT = process.env.PORT || 8000;
const fs = require('fs');
const qs = require('querystring');
let givenURLs = ['/helium.html', '/hydrogen.html', '/'];

const server = http.createServer((req, res) => {
  console.log('\nreq.method =', req.method);
  console.log('req.url =', req.url);
  console.log('req.headers =', req.headers);

  if (req.method === 'POST') {
    if (req.url === '/elements') {
      let body = [];
      req.on('data', (chunk) => {
        console.log('\nCL chunk =', chunk);
        body.push(chunk);
        console.log('\nCL start body =', body);
      }).on('end', (chunk) => {
        body = Buffer.concat(body).toString();
        console.log('\nCL end body =', body);
        let parsedBody = qs.parse(body);
        console.log('\nCL parsedBody =', parsedBody);

        givenURLs.push(`/${parsedBody.elementName}.html`);
        console.log('new givenURLs =', givenURLs);

        const resBodyContents = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>The Elements - ${parsedBody.elementName}</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <h1>${parsedBody.elementName}</h1>
          <h2>${parsedBody.elementSymbol}</h2>
          <h3>Atomic number ${parsedBody.elementAtomicNumber}</h3>
          <p>${parsedBody.elementName} is a chemical element with symbol ${parsedBody.elementSymbol} and atomic number ${parsedBody.elementAtomicNumber}.</p>
          <p><a href="/">back</a></p>
        </body>
        </html>`;

        fs.writeFile(`./public/${parsedBody.elemenName}.html`, resBodyContents, err => {
          if (err) {
            res.writeHead(500);
            res.write('{status: BROKEN}');
            res.end();
          }
          else {
            res.writeHead(200);
            res.write('{status: OK}');
            res.end();
          }
        })
      })
    }
  }

  console.log('CL check givenURLs =', givenURLs);

  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        if (err) {
          fs.readFile('./public/404.html', (err, data) => {
            res.writeHead(404, {'content-type': 'text/html'});
            res.write(data);
            res.end();
          })
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
          fs.readFile('./public/404.html', (err, data) => {
            res.writeHead(404, {'content-type': 'text/html'});
            res.write(data);
            res.end();
          })
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
          fs.readFile('./public/404.html', (err, data) => {
            res.writeHead(404, {'content-type': 'text/html'});
            res.write(data);
            res.end();
          })
        }
        else {
          res.writeHead(200, { 'content-type': 'text/html' });
          res.write(data);
          res.end();
        }
      });
    }
    else if (req.url === undefined) {
      fs.readFile('./public/404.html', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.write('404.html GET ERROR');
          res.end();
        }
        else {
          res.writeHead(404, { 'content-type': 'text/html' });
          res.write(data);
          res.end();
        }
      });
    }
  }
}).listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
