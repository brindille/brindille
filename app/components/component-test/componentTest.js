'use strict';

var Component = require('lib/Component');
var fs = require('fs');
var inherits = require('inherits');

function ComponentTest() {
    this.template = require('./componentTest.html');
    this.data = {
        url: 'http://google.com',
        label: 'test'
    };
}
inherits(ComponentTest, Component);

module.exports = ComponentTest;