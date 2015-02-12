'use strict';

var Layout = require('lib/Layout');
var fs = require('fs');

var footer = new Layout({
    el: 'footer',
    template: fs.readFileSync(__dirname + '/footer.html', 'utf8'),
    data: {}
});

module.exports = footer;