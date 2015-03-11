'use strict';

var factory = require('lib/factory');

var ComponentTest = factory.view({
  template: require('./componentTest.html'),
  model: {
    'label': 'test',
    'url': 'google.com'
  }
});

module.exports = ComponentTest;
