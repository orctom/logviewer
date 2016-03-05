var elasticsearch = require('elasticsearch');
var moment = require('moment');
var config = require('../config');
var client = new elasticsearch.Client(config.es);

exports.search = function(req, res) {
  var site = req.query.site;
  var q = req.query.q;
  var start = req.query.start;
  var end = req.query.end;
  var startDate = start ? moment(Number(start)) : moment().subtract(10, 'days');
  var endDate = end ? moment(Number(end)) : moment();

  client.search({
    index: 'was-2016.02',
    type: 'was',
    body: {
      query: {
        filtered: {
          query: {
            match: {
              exception: q
            }
          },
          filter: {
            range: {
              "@timestamp": {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      }
    }
  }).then(function(data) {
    console.log("result....");
    res.render('search', {
      site: site,
      q: q,
      start: startDate,
      end: endDate,
      hits: data.hits
    });
  }, function(err) {
    console.log("error " + err.message);
    res.render('search', {
      site: site,
      q: q,
      start: startDate,
      end: endDate,
      error: err.message
    });
  });
};