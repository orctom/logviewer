var amqp = require('amqplib');
var socketio = require('socket.io');
var logs = new Array(50);

module.exports = function(config, server) {
  // socket.io
  var io = socketio(server);
  io.on('connection', (socket) => {
    console.log('on connection');
    sendCachedLogs(io);
    socket.on('clientId', function(msg) {
      console.log("...server clientId...::" + msg + ":::::::");
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
        io.on('clientId', function(msg) {
          console.log("...server clientId...::" + msg + "::");
        });
        ch.consume(queue, function(msg) {
          var data = {
            'timestamp': Date.now(),
            'data': msg.content.toString()
          };
          logs.push(data);
          while (logs.length >= 20) {
            logs.shift();
          }
          io.sockets.emit('log', data);
        }, {
          noAck: true
        });
      });
    });
  });
};

var sendCachedLogs = function(io) {
  logs.forEach(function(item) {
    io.sockets.emit("log", item);
  });
};