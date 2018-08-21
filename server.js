const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const PORT = process.env.PORT || 8080;



// CREATE SERVER

const server = http.createServer((req, res) => {
  console.log('\nreq.method =', req.method);
  console.log('req.url =', req.url);
  console.log('req.headers =\n', req.headers);



// POST

    // COPIED FROM https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/ 

  if (req.method === 'POST') {
    if (req.url === '/elements') {
      let body = [];
      req.on('data', (chunk) => {
        console.log('\nchunk =\n', chunk);
        body.push(chunk);
        console.log('\nstart body =\n', body);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('\nBuffer =\n', Buffer);
        console.log('\nend body =\n', body);
    
// QUERYSTRING USED HERE TO MAKE AN OBJECT CALLED parsedBody    
    
        let parsedBody = qs.parse(body);
        console.log('\nparsedBody =\n', parsedBody);


// NEW ELEMENT TEMPLATE

        const resBodyContents = 
        `<!DOCTYPE html>
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
          <p>${parsedBody.elementInfo}</p>
          <p><a href="/">back</a></p>
        </body>
        </html>`
        

// WRITE TO NEW ELEMENT TEMPLATE

        fs.writeFile(`./public/${parsedBody.elementName.toLowerCase()}.html`, resBodyContents, err => {
          if (err) {
            res.writeHead(500, { 'content-type': 'text/html' });
            res.write('{status: BROKEN}');
            res.end();
          }
          else {
            res.writeHead(200, { 'content-type': 'text/html' });

// DON'T WRITE OR END ANYTHING HERE OR YOU WILL CRASH THE SERVER
            // res.write()
            // res.end()
          }
        })



// READ DIRECTORY OF ./public FOLDER

        fs.readdir('./public', function (err, files) {
          console.log('\nfiles =\n', files);
          console.log('\nfiles.length =', files.length);



// CREATE ARRAY OF ELEMENTS FROM ./public FOLDER

          const elementArr = files.filter(file => {
            if (file !== 'index.html' && file !== '.keep' && file !== 'css' && file !== '404.html') {
              // console.log('file =', file);
              return file;
            }
          })

          console.log('\nelementArr =\n', elementArr);
          console.log('\nelementArr.length =', elementArr.length);
          


// USE ARRAY OF ELEMENTS TO MAKE HTML LIST OF ELEMENTS
// INVOKE THIS FUNCTION INSIDE OF NEW INDEX.HTML TEMPLATE 

          let elemHTML = ``;

          let listElements = (elem) => {
            for (var i=0; i<elem.length; i++) {
              elemHTML += `\n           <li>
              <a href= "${elem[i].toLowerCase()}">${(elem[i].split('.'))[0].charAt(0).toUpperCase()}${(elem[i].split('.'))[0].slice(1)}</a>
            </li>\n`
            }
            console.log('\nelemHTML =\n', elemHTML);
            return elemHTML;
          }

  

// NEW INDEX.HTML TEMPLATE

          let newIndex = 
          `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>The Elements</title>
            <link rel="stylesheet" href="/css/styles.css">
          </head>
          <body>
            <h1>The Elements</h1>
            <h2>These are all the known elements.</h2>
            <h3>These are ${elementArr.length}</h3>
            <ol>
              ${listElements(elementArr)}
            </ol>
          </body>
          </html>`
  


// WRITE TO INDEX.HTML TEMPLATE

          fs.writeFile('./public/index.html', newIndex, err => {
            if (err) {
                res.writeHead(404, {'content-type': 'text/html'});
                res.write('{Success: false newIndex not created}');
                res.end();
            }
            else {
              res.writeHead(200, { 'content-type': 'text/html' });
              res.write('{Success: true newIndex created}');
              res.end();
            }
          });
        })
      })
    }
  }


// GET 

  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile('./public/index.html', 'utf-8', (err, data) => {
          res.writeHead(200, { 'content-type': 'text/html' });
          res.write(data);
          res.end();
      });
    }
    else if (req.url === '/css/styles.css') {
      fs.readFile('./public/css/styles.css', 'utf-8', (err, data) => {
          res.writeHead(200, { 'content-type': 'text/css' });
          res.write(data);
          res.end();
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
  }
}).listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
