var winston = require('winston');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            json: false,
            timestamp: true
        }),
        new(winston.transports.File)({
            filename: '/var/log/logviewer/logviewer.log'
        })
    ],
    exceptionHandlers: [
        new(winston.transports.Console)({
            json: false,
            timestamp: true
        }),
        new(winston.transports.File)({
            filename: '/var/log/logviewer/exception.log'
        })
    ],
    exitOnError: false
});

module.exports = logger;