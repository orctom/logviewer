var config = module.exports = {};

config.env = 'production';
config.port = 3000;
config.mq = {
  url: "amqp://mq:mq@mq:5672"
};