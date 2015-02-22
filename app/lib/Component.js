'use strict';

var View = require('./View');

/**
 * class Component
 * Manage each component with data, template and actions given
 * @param {object} options
 */
function Component () {
    this.template = '';
    this.data = {};
}

Component.prototype.setData = function(parentData) {
    if(!parentData) return;

    for(var dataName in this.data) {
        this.data[dataName] = parentData[dataName] || this.data[dataName];
    }
};

module.exports = Component;