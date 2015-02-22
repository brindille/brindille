'use strict';

var Component = require('lib/Component');
var fs = require('fs');

function ComponentTest() {
    Component.call(this);

    this.template = fs.readFileSync(__dirname + '/componentTest.html', 'utf8');
    this.data = {
        url: 'http://google.com',
        label: 'test'
    };
}

ComponentTest.prototype = new Component; // jshint ignore:line
ComponentTest.prototype.constructor = ComponentTest;

module.exports = ComponentTest;