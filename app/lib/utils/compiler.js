'use strict';

var doT = require('dot');

var compiler = {
    settings: {
        /*
            {# }   for evaluation
            {{ }}  for interpolation
            {{{ }}}  for interpolation with encoding
            {{> }}  for compile-time evaluation/includes and partials
            {{## #}}    for compile-time defines
            {{? }}  for conditionals
            {{~ }}  for array iteration
         */
        evaluate:    /\{#([\s\S]+?)\}/g,
        interpolate: /\{\{([\s\S]+?)\}\}/g,
        encode:      /\{\{\{!([\s\S]+?)\}\}\}/g,
        use:         /\{\{>([\s\S]+?)\}\}/g,
        define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname: 'data',
        strip: true,
        append: true,
        selfcontained: false
    },
    render: function(tmpl, data) {
        doT.templateSettings = this.settings;
        var t = doT.template(tmpl);

        return t(data);
    }
};

module.exports = compiler;