var amqp = require('amqplib');
var socketio = require('socket.io');

module.exports = function(config, server) {
  // socket.io
  var io = socketio(server);
  io.on('connection', (socket) => {
    console.log('a user connected');
    io.sockets.emit("log", "Pulling logs...");
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
        ch.bindQueue(queue, exchangeName, '', {
          'x-max-length': 20
        });
        return queue;
      }).then(function(queue) {
        ch.consume(queue, function(msg) {
          io.sockets.emit('log', msg.content.toString());
        }, {
          noAck: true
        });
      });
    });
  });
};