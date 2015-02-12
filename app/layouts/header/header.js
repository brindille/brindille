'use strict';

var Layout = require('lib/Layout');
var fs = require('fs');

var header = new Layout({
    el: 'header',
    template: fs.readFileSync(__dirname + '/header.html', 'utf8'),
    data: {}
});

module.exports = header;