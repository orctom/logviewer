var config = require('./config.default');

config.env = 'development';

config.mq = {
  url: "amqp://mq:mq@10.164.39.65:5672"
};

config.es = {
  host: 'localhost:9200',
  log: 'info'
};

module.exports = config;