var config = require('./config');

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');

var browserify = require('browserify-middleware');

var app = express();

var logger = require('./config/logger');

// add moment to express
app.locals.moment = require('moment');

// General Setup
app.configure(function() {
    app.set('port', process.env.PORT || config.port);
    app.set('env', config.env);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

    //app.use('/js', browserify('./modules', {
    //    transform: ['jadeify']
    //}));

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

/// error handlers
require('./config/error-handler')(app);

// routes
require('./app/routes.js')(app, config, logger);

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});