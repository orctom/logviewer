var elasticsearch = require('elasticsearch');
var config = require('../config');
var client = new elasticsearch.Client(config.es);

exports.search = function(req, res) {
  var site = req.query.site;
  var q = req.query.q;
  client.search({
    index: 'was-2016.02',
    type: 'was',
    body: {
      query: {
        match: {
          exception: q
        }
      }
    }
  }).then(function(data) {
    res.render('search', {
      site: site,
      q: q,
      hits: data.hits
    });
  }, function(err) {
    res.render('search', {
      site: site,
      q: q,
      error: err.message
    });
  });
};