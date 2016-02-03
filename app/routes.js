var config = require('../config');

var dashboard = require('./dashboard');

module.exports = function(app, logger) {

  //=====================   home   =======================
  app.get('/', dashboard.index);
  app.get('/www', dashboard.www);
  app.get('/bsd', dashboard.bsd);

};