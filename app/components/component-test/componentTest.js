'use strict';

var factory = require('lib/factory');
var View = require('brindille-view');
var inherits = require('inherits');
var extend = require('extend');

function ComponentTest(model) {
  console.log('componentTest', model);
  View.call(this, {
    template: require('./componentTest.html'),
    model: extend({
      'label': 'test',
      'url': 'perdu.com'
    }, model)
  });
}

inherits(ComponentTest, View);

module.exports = ComponentTest;
