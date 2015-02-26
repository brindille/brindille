'use strict';

var View = require('./View'),
    inherits = require('inherits'),
    verbose = require('config').verbose;

/**
 * class Layout extends View
 * Manage each layout with node where append to, data, template and actions given
 * @param {object} options
 */
function Layout (options) {
    /*
        Node where append layout
     */
    this.el = document.querySelector( options.el ) || document.body;
    /*
        html template
     */
    this.template = options.template || '';
    /*
       data for template
     */
    this.data = options.data || {};
    /*
        components of layout
     */
    this.components = options.components || {};
}
inherits(Layout, View);

/**
 *  Set all your events
 */
Layout.prototype.addEvents = function() {
    if(verbose) console.warn("[Layout] You need to override layout.addEvents");
};

/**
 * Remove events to prevent memory leaks
 */
Layout.prototype.removeEvents = function() {
    if(verbose) console.warn("[Layout] You need to override layout.removeEvents");
};

module.exports = Layout;