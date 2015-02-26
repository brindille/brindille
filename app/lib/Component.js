'use strict';

var View = require('./View'),
    inherits = require('inherits'),
    verbose = require('config').verbose;

/**
 * class Component extends View
 * Manage each component with data, template and actions given
 * @param {object} options
 */
function Component (options) {
    /*
        html template
     */
    this.template = options.template || '';
    /*
       data for template
     */
    this.data = options.data || {};
    /*
        sub components
     */
    this.components = options.components || {};
    /*
        parent view
     */
    this.parent = {};
}
inherits(Component, View);

/**
 *  Set all your events
 */
Component.prototype.addEvents = function() {
    if(verbose) console.warn("[Component] You need to override component.addEvents");
};

/**
 * Remove events to prevent memory leaks
 */
Component.prototype.removeEvents = function() {
    if(verbose) console.warn("[Component] You need to override component.removeEvents");
};

/**
 * Set data from parent
 * @param {object} parentData data object such as {foo: bar}
 */
Component.prototype.setData = function(parentData) {
    if(!parentData) return;

    for(var dataName in this.data) {
        this.data[dataName] = parentData[dataName] || this.data[dataName];
    }
};

module.exports = Component;