var View = require('brindille-view');
var inherits = require('inherits');
var extend = require('extend');
var clone = require('clone');

module.exports = {
  /**
   * Create class inheried from View
   * @param  {Object} opt
   * @return {Function}
   */
  view: function(opt) {
    var f = new Function(
    'opt', 'extend', 'ViewBase', 'clone',
    'return function View (model) { if(model) {opt.model = extend(opt.model, model);} ViewBase.call(this, clone(opt)); };'
    )(opt, extend, View, clone);
    inherits(f, View);

    return f;
  },
  /**
   * Instanciate new view
   * @param  {Object} opt
   * @return {View}
   */
  viewInstance: function(opt) {
    return new View(opt);
  }
};