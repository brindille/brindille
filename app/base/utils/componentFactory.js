var View = require('base/View'),
    inherits = require('inherits'),
    extend = require('extend');

module.exports = {
    create: function (opt) {
        var f = new Function( // jshint ignore:line
            'opt', 'extend', 'View',
            'return function Component (data) { opt.data = extend(opt.data, data); View.call(this, opt); };'
        )(opt, extend, View);
        inherits(f, View);

        return f;
    }
};