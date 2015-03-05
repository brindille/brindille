'use strict';

var Factory = require('base/utils/factory');

var ComponentTestH = Factory.view({
    template: require('./componentTestH.dom'),
    model: {
        test: false
    }
});

ComponentTestH.prototype.fnTest = function() {
    // console.log('Crazy test');
};

ComponentTestH.prototype.ready = function() {
    this.fnTest();
};

module.exports = ComponentTestH;