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
          var message = msg.content.toString().split(':');
          var site = message[0];
          var text = message[1];
          var data = {
            'site': site,
            'data': text
          };
          logs.push(data);
          io.sockets.emit(site, data);

          while (logs.length >= 20) {
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