var config = require('./config.default');

config.env = 'development';

config.mq = {
  url: "amqp://mq:mq@localhost:5672"
};

config.es = {
  host: 'localhost:9200',
  log: 'info'
};

module.exports = config;