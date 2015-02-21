'use strict';

var compiler = require('./compiler');

/**
 * class View
 * Every view, layout and component herit this class
 */
function View () {
    this.el = null;
    this.template = '';
    this.data = {};
}

/**
 * Append view to container
 * @param  {DOMElement} el Optional - Element where append templat
 */
View.prototype.append = function(el) {
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

/**
 *  Set all your events
 */
View.prototype.addEvents = function() {

};

/**
 * Remove events to prevent memory leaks
 */
View.prototype.removeEvents = function() {

};

/**
 * Destroy view when it is not needed anymore
 */
View.prototype.destroy = function() {
    this.removeEvents();
};

module.exports = View;