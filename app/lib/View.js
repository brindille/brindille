'use strict';

var compiler = require('utils/compiler');
var verbose = require('config').verbose;

/**
 * class View
 * Every view, layout and component herit this class
 */
function View () {
    /*
        Main application
     */
    this.app = null;
    /*
        Node where append view
     */
    this.el = null;
    /*
        html template
     */
    this.template = '';
    /*
        data for template
     */
    this.data = {};
    /*
        components of view
     */
    this.components = {};
}

/**
 * Bind view
 * @param  {Function} callback
 */
View.prototype.bind = function (callback) {};

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
            c.bind();
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
            this.components[component].el = div;
            container.parentNode.replaceChild(div, container);
            this.components[component].addEvents();
            this.components[component].ready();
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
    if(verbose) console.warn("[View] You need to override view.addEvents");
};

/**
 * Unbind view
 * @param  {Function} callback
 */
View.prototype.unbind = function (callback) {};

/**
 * Operations to do before destroying vien
 */
View.prototype.beforeDestroy = function() {};

/**
 * Remove events to prevent memory leaks
 */
View.prototype.removeEvents = function() {
    if(verbose) console.warn("[View] You need to override view.removeEvents");
};

/**
 * Destroy view when it is not needed anymore
 */
View.prototype.destroy = function() {
    for(var i in this.components) {
        this.components[i].unbind();
        this.components[i].destroy();
    }
    this.beforeDestroy();
    this.removeEvents();
};

module.exports = View;