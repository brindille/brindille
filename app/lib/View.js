'use strict';

var compiler = require('./compiler');
var verbose = require('app/config').verbose;
var Component = require('./Component');

/**
 * class View
 * Every view, layout and component herit this class
 */
function View () {
    this.app = null;
    this.el = null;
    this.template = '';
    this.data = {};
    this.components = {};
}

/**
 * Append view to container
 * @param  {DOMElement} el Optional - Element where append templat
 */
View.prototype.append = function() {
    if(!this.template) {
        console.error('Cannot append null template');
        return;
    }

    var $el = this.el || this.app.el;

    if(!$el) {
        console.error('Cannot append to null node');
        return;
    }

    // Append template
    $el.setAttribute('hidden', '');
    $el.innerHTML = compiler.render(this.template, this.data);
    this.appendComponents();
    $el.removeAttribute('hidden');

    this.addEvents();
};

/**
 * Compile view components and add it to the DOM
 */
View.prototype.appendComponents = function() {
    var el = this.el || this.app.el;
    var data = {};
    var container, tmpl, html, div, id;
    var c, Ctor;
    for(var component in this.components) { // go on all view components
        id = this.components[component].componentId;
        container = el.querySelector(id + '[ref='+ component + ']');
        if(container) { // component is appended to DOM
            Ctor = this.app.getComponent(id);
            c = new Ctor();
            c.setData( this.components[component].data );
            html = compiler.render(c.template, c.data);
            this.components[component] = c;
            // remplace node by compiled HTMl
            div = document.createElement('div');
            if (div.classList) {
              div.classList.add(id);
            } else {
              div.className += ' ' + id;
            }
            div.innerHTML = html;
            container.parentNode.replaceChild(div, container);
        }
    }
};

/**
 * Operations you want to do when the view is ready (created + mounted)
 */
View.prototype.ready = function() {};

/**
 *  Set all your events
 */
View.prototype.addEvents = function() {
    if(verbose) console.warn("[View] - You need to override view.addEvents");
};

/**
 * Remove events to prevent memory leaks
 */
View.prototype.removeEvents = function() {
    if(verbose) console.warn("[View] - You need to override view.removeEvents");
};

/**
 * Operations to do before destroying vien
 */
View.prototype.beforeDestroy = function() {};

/**
 * Destroy view when it is not needed anymore
 */
View.prototype.destroy = function() {
    this.removeEvents();
};

module.exports = View;