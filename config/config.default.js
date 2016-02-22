var config = module.exports = {};

config.env = "production",
config.port = 3000;
config.mq = {
  user: process.env.MQ_USER || "mq",
  password: process.env.MQ_PASSW0RD || "mq",
  host: process.env.MQ_HOST || "mq",
  port: process.env.MQ_PORT || 5672,
  url: function() {
    return "amqp://" + this.user + ":" + this.password + "@" + this.host + ":" + this.port;
  }
};

config.es = {
  host: process.env.ES_HOST || "es:9200",
  log: "info"
};