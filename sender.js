#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');
var util = require('util');

amqp.connect('amqp://mq:mq@localhost').then(function(conn) {
  return when(conn.createChannel().then(function(ch) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function(text) {
      var ex = 'was';
      ch.assertExchange(ex, 'fanout', {
        durable: false
      })
      ch.publish(ex, '', new Buffer(text));
      console.log('sent: ', text);
      if (text === 'quit\n') {
        console.log('Now that process.stdin is paused, there is nothing more to do.');
        process.exit();
        conn.close();
      }
    });
  }));
}).then(null, console.warn);