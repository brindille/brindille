'use strict';

var Layout = require('lib/Layout');
var fs = require('fs');

var header = new Layout({
    el: 'header',
    template: require('./header.html'),
    data: {}
});

module.exports = header;