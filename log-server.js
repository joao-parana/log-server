var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var static = require('node-static');

/* http://www.sitepoint.com/serving-static-files-with-node-js */
var webroot = ".";
var options = {
  cache : 600,
  headers : {
    'X-Powered-By' : 'node-static'
  }
};
var fileServer = new static.Server(webroot, options);

// Ver o que será necessário fazer de refactory abaixo
app.listen(80);

io.configure('development', function() { // can be 'production' too
  io.set('log level', 2); // reduce logging to INFO level
  // io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile',
  // 'xhr-polling', 'jsonp-polling' ]);
});

function handler(req, res) {
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
