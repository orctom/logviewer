var config = require('../config');

var dashboard = require('./dashboard');
var searcher = require('./searcher');

module.exports = function(app, logger) {

  //=====================   home   =======================
  app.get('/', dashboard.index);
  app.get('/www', dashboard.www);
  app.get('/bsd', dashboard.bsd);

  app.get('/search', searcher.search);

};