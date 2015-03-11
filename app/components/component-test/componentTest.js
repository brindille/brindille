'use strict';

var factory = require('lib/factory');

var ComponentTest = factory.view({
  template: require('./componentTest.html'),
  model: {
    url: 'http://google.com',
    label: 'test'
  },
  compose: {},
  resolve: {}
});

module.exports = ComponentTest;
