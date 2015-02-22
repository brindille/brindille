'use strict';

var View = require('./View');

/**
 * class Layout extends View
 * Manage each layout with node where append to, data, template and actions given
 * @param {object} options
 */
function Layout (options) {
    View.call(this);

    this.el = document.querySelector( options.el ) || document.body;
    this.template = options.template || '';
    this.data = options.data || {};
    this.components = options.components || {};
}

Layout.prototype = new View; // jshint ignore:line
Layout.prototype.constructor = Layout;

module.exports = Layout;