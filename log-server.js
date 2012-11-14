var app = require('http');
var io = require('socket.io');
var fs = require('fs');
var serveStaticFiles = require('node-static');
var port = 80;

/* http://www.sitepoint.com/serving-static-files-with-node-js */
var webroot = ".";
var options = {
  cache : 600,
  headers : {
    'X-Powered-By' : 'SOMA'
  }
};

var staticFileServer = new serveStaticFiles.Server(webroot, options);

var myReqResVO = {};

function httpHandlerSimpleVersion(req, res) {
  myReqResVO.req = req;
  myReqResVO.res = res;
  io.configure('development', function() { // can be 'production' too
    io.set('log level', 2); // reduce logging to INFO level
    // io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile',
    // 'xhr-polling', 'jsonp-polling' ]);
  });

  var resource = '.' + myReqResVO.req.url;
  console.log('Carregando : ' + resource);
  fs.readFile(__dirname + myReqResVO.req.url, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + resource + ' from "'
          + (__dirname + req.url) + '"');
    }
    myReqResVO.res.writeHead(200);
    myReqResVO.res.end(data);
  });
}

function httpHandlerStaticFilesVersion(req, res) {
  ioServer.configure('development', function() { // can be 'production' too
    ioServer.set('log level', 2); // reduce logging to INFO level
    // ioServer.set('transports', [ 'websocket', 'flashsocket', 'htmlfile',
    // 'xhr-polling', 'jsonp-polling' ]);
  });
  req.addListener('end', function requestEndEventHandle() {
    staticFileServer.serve(req, res, function handleHttpErrForStaticFileServer(
        err, result) {
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
        console.log('** loading %s - %s', req.url,
            transverseAndAppendText(res, true));
      }
    });
  });
}

// Ver o que será necessário fazer de refactory abaixo
var appServer = app.createServer(httpHandlerStaticFilesVersion).listen(port);

var ioServer = io.listen(appServer)

console.log('node-static running at http://localhost:%d', port);

function transverseAndAppendText(myObject, detailLevel) {

  return transverse(myObject, formatLog, detailLevel);

  function transverse(myObject, func, detailLevel) {
    var ret = "";
    for ( var prop in myObject) {
      // to filter out prototype properties
      if (myObject.hasOwnProperty(prop)) {
        ret = func(ret, detailLevel || false, '\n' + prop + ': ',
            myObject[prop]);
      }
    }
    return ret;
  }

  function formatLog(msg, detailLevel, prop, msg) {
    return msg + ((detailLevel) ? prop : '') + msg;
  }
}

ioServer.sockets.on('connection', function(socket) {
  // https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
  socket.emit('news-from-server', {
    hello : 'Server Up and Running'
  });
  console.log('-- New Connection established ' + (new Date()).toString());
  console.log('Waiting for "log-event" from client');
  socket.on('log-event', function(data) {
    console.log('LOG_FROM_CLIENT ' + transverseAndAppendText(data));
  });
});
