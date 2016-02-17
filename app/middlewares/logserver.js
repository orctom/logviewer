var amqp = require('amqplib');
var socketio = require('socket.io');
var logs = new Array(50);

module.exports = function(config, server) {
  // socket.io
  var io = socketio(server);
  io.on('connection', (socket) => {
    console.log('on connection');
    socket.on('request', function(msg) {
      console.dir(msg);
      var clientId = msg.clientId;
      var site = msg.site;
      sendCachedLogs(io, site);
    });
  });


  // rabbmitmq
  amqp.connect(config.mq.url).then(function(conn) {
    conn.createChannel().then(function(ch) {
      var exchangeName = 'was';
      var queueName = 'logtailer';
      ch.assertExchange(exchangeName, 'fanout', {
        durable: false
      }).then(function() {
        return ch.assertQueue(queueName, {
          durable: false,
          maxLength: 50
        });
      }).then(function(qOK) {
        var queue = qOK.queue;
        ch.bindQueue(queue, exchangeName, '');
        return queue;
      }).then(function(queue) {
        ch.consume(queue, function(msg) {
          var data = JSON.parse(msg.content.toString());
          logs.push(data);
          io.sockets.emit(data.site, data);

          while (logs.length >= 50) {
            logs.shift();
          }
        }, {
          noAck: true
        });
      });
    });
  });
};

var sendCachedLogs = function(io, site) {
  console.log('sendCachedLogs: ' + site);
  logs.forEach(function(item) {
    if (item.site == site) {
      io.sockets.emit(site, item);
    }
  });
};