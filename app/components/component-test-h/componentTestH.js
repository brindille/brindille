'use strict';

var ComponentFactory = require('base/utils/componentFactory');

var ComponentTestH = ComponentFactory.create({
    template: require('./componentTestH.html'),
    data: {
        test: false
    }
});

ComponentTestH.prototype.fnTest = function() {
    console.log('Crazy test');
};

ComponentTestH.prototype.ready = function() {
    this.fnTest();
};

module.exports = ComponentTestH;