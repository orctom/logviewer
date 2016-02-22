## Logviewer hard-coded for OD

### Pre-condition
 * MQ server, that receives Java application logs from Logstash forwarder;
 * Elasticsearch server/cluster that have the exceptions indexed.

### Develop
```
npm install -g -q bower gulp-cli

npm install -q

bower install -q

gulp
```

### Docker
```
docker run -d \
  -p 3000:3000
  -e MQ_USER=user \
  -e MQ_PASSW0RD=password \
  -e MQ_HOST=mq_host \
  -e MQ_PORT=5679 \
  -e ES_HOST=es_host:9200 \
  orctom/logviewer
```