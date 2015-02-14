'use strict';

var compiler = require('./compiler');

/*
    AbstractView class
    Every view, layout and component herit this class
 */
function AbstractView (options) {
    this.el = null;
    this.template = '';
    this.data = {};
}

/*
    Append view to container
 */
AbstractView.prototype.append = function(el) {
    if(!this.template) {
        console.error('Cannot append null template');
        return;
    }

    var $el = el || this.el;

    if(!$el) {
        console.error('Cannot append to null node');
        return;
    }

    // Append template
    $el.innerHTML = compiler.render(this.template, this.data);
};

/*
    Set all your events
 */
AbstractView.prototype.addEvents = function() {

};

/*
    Remove events to prevent memory leaks
 */
AbstractView.prototype.removeEvents = function() {

};

/*
    Destruct view when it is not needed anymore
 */
AbstractView.prototype.destruct = function() {
    this.removeEvents();
};

module.exports = AbstractView;