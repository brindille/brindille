'use strict';

var View = require('base/View'),
    inherits = require('inherits');

function ComponentTestH(data) {
    View.call(this, {
        template: require('./componentTestH.html'),
        data: data // if you want you can extend
    });
}

inherits(ComponentTestH, View);

module.exports = ComponentTestH;