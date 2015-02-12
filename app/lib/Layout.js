'use strict';

var AbstractView = require('./AbstractView');

/*
    Layout class
    Manage each layout with node where append to, data, template and actions given
 */
function Layout (options) {
    this.el = document.querySelector( options.el ) || document.body;
    this.template = options.template || '';
    this.data = options.data || {};
}

Layout.prototype = new AbstractView; // jshint ignore:line
Layout.prototype.constructor = Layout;


module.exports = Layout;