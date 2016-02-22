var config = require('./config');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var logger = require('./config/logger');

var app = express();
app.set('env', config.env);

app.locals.moment = require('moment');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));

// routes
require('./app/routes.js')(app, logger);

/// error handlers
require('./config/error-handler')(app);

// startup
var http = require('http');
var port = process.env.PORT || config.port;
app.set('port', port);

var server = http.createServer(app);
server.listen(port, function() {
  console.log('Server listening on port ' + port);
});

// amqp & socket.io
require('./app/middlewares/logserver.js')(config, server);