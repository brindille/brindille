'use strict';

var factory = require('lib/factory');

var Footer = factory.viewInstance({
  template: require('./footer.html'),
  model: {},
  compose: {},
  resolve: {}
});

module.exports = Footer;
