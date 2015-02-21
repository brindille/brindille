'use strict';

var View = require('./View');

/*
    Layout class
    Manage each layout with node where append to, data, template and actions given
 */
function Layout (options) {
    View.call(this);

    this.el = document.querySelector( options.el ) || document.body;
    this.template = options.template || '';
    this.data = options.data || {};
}

Layout.prototype = new View; // jshint ignore:line
Layout.prototype.constructor = Layout;


module.exports = Layout;