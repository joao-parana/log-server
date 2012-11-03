var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');
  
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
