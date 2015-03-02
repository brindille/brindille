var View = require('base/View'),
    inherits = require('inherits'),
    extend = require('extend');

module.exports = {
    /**
     * Create class inheried from View
     * @param  {Object} opt
     * @return {Function}
     */
    view: function (opt) {
        var f = new Function( // jshint ignore:line
            'opt', 'extend', 'ViewBase',
            'return function View (data) { if(data) {opt.data = extend(opt.data, data);} ViewBase.call(this, opt); };'
        )(opt, extend, View);
        inherits(f, View);

        return f;
    },
    /**
     * Instanciate new view
     * @param  {Object} opt
     * @return {View}
     */
    viewInstance: function (opt) {
        return new View(opt);
    }
};