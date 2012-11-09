var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var static = require('node-static');
  

/* http://www.sitepoint.com/serving-static-files-with-node-js  */
var webroot = ".";
var options = {
  cache: 600,
  headers: { 'X-Powered-By': 'node-static' }
};
var fileServer = new static.Server(webroot, options);

// Ver o que será necessário fazer de refactory abaixo
app.listen(80);

function handler (req, res) {
  var resource = '.' + req.url;
  console.log('Carregando : ' + resource);
  fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + resource + ' from "' + (__dirname + req.url) + '"');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('news-from-server', { hello: 'world' });
  socket.on('log-event', function (data) {
    console.log(data);
  });
});
