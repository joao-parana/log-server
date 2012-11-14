var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var serveStaticFiles = require('node-static');

/* http://www.sitepoint.com/serving-static-files-with-node-js */
var webroot = ".";
var options = {
  cache : 600,
  headers : {
    'X-Powered-By' : 'SOMA'
  }
};

var staticFileServer = new serveStaticFiles.Server(webroot, options);

function httpHandlerSimpleVersion(req, res) {
  var resource = '.' + req.url;
  console.log('Carregando : ' + resource);
  fs.readFile(__dirname + req.url, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + resource + ' from "'
          + (__dirname + req.url) + '"');
    }
    res.writeHead(200);
    res.end(data);
  });
}

function handleHttpErrForStaticFileServer(err, result) {
  if (err) {
    console.error('Error serving %s - %s', req.url, err.message);
    if (err.status === 404) {
      staticFileServer.serveFile('/404.html', err.status, {}, req, res);
    } else if (err.status === 500) {
      staticFileServer.serveFile('/500.html', err.status, {}, req, res);
    } else {
      res.writeHead(err.status, err.headers);
      res.end();
    }
  } else {
    console.log('%s - %s', req.url, res.message);
  }
}

function requestEndEventHandle() {
  staticFileServer.serve(req, res, handleHttpErrForStaticFileServer);
}

function httpHandlerStaticFilesVersion(req, res) {
  req.addListener('end', requestEndEventHandle);
}

// Ver o que será necessário fazer de refactory abaixo
app.createServer(httpHandlerStaticFilesVersion).listen(80);

console.log('node-static running at http://localhost:%d', port);

io.sockets.on('connection', function(socket) {
  socket.emit('news-from-server', {
    hello : 'world'
  });
  socket.on('log-event', function(data) {
    console.log(data);
  });
});
