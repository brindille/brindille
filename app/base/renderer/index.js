'use strict';

var doT = require('dot'),
    domify = require('domify'),
    walk = require('dom-walk');

var renderer = {
    settings: {
        /*
            {{ }}   for evaluation
            {{= }}  for interpolation
            {{! }}  for interpolation with encoding
            {{# }}  for compile-time evaluation/includes and partials
            {{## #}}    for compile-time defines
            {{? }}  for conditionals
            {{~ }}  for array iteration
         */
        evaluate:    /\{\{([\s\S]+?)\}\}/g,
        interpolate: /\{\{=([\s\S]+?)\}\}/g,
        encode:      /\{\{!([\s\S]+?)\}\}/g,
        use:         /\{\{#([\s\S]+?)\}\}/g,
        define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname: 'data',
        strip: true,
        append: true,
        selfcontained: false
    },
    compile: function(tmpl) {
        return doT.template(tmpl);
    },
    render: function(tmplFn, data) {
        return domify(tmplFn(data));
    }
};

doT.templateSettings = renderer.settings;

module.exports = renderer;