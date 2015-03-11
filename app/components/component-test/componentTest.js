'use strict';

var factory = require('lib/factory');

var ComponentTest = factory.view({
  template: require('./componentTest.html'),
  model: {
    'label': 'test',
    'url': 'perdu.com'
  }
});

module.exports = ComponentTest;
