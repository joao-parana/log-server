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
  io.configure('development', function() { // can be 'production' too
    io.set('log level', 2); // reduce logging to INFO level
    // io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile',
    // 'xhr-polling', 'jsonp-polling' ]);
  });

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

var logMsg = '';

function transverse(myObject, func) {
  var ret = null;
  for ( var prop in myObject) {
    // to filter out prototype properties
    if (myObject.hasOwnProperty(prop)) {
      ret = func('\n' + prop + ': ', myObject[prop]);
    }
  }
  logMsg = '';
  return ret;
}

function formatLog(prop, msg) {
  return logMsg + msg;
}

io.sockets.on('connection', function(socket) {
  // https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO

  socket.emit('news-from-server', {
    hello : 'world'
  });
  console.log('---  New Connection established ' + (new Date()).toString()
      + ' ---');
  console.log('Waiting for "log-event" from client');
  socket.on('log-event', function(data) {
    console.log('LOG_FROM_CLIENT ' + transverse(data, formatLog));
  });
});
