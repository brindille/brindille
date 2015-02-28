'use strict';

var renderer = require('base/renderer'),
    domUtils = require('base/utils/dom'),
    Emitter = require('emitter-component'),
    nextTick = require('just-next-tick'),
    forEach = require('for-each'),
    bindAll = require('bindall-standalone'),
    verbose = require('config').verbose,
    walk = require('dom-walk'),
    observer = require('watchjs'),
    inherits = require('inherits');

/**
 * class View
 * Every view, layout and component herit this class
 */
function View(options) {
    options = options || {};

    /*
        Compiled Dom object of the view
     */
    this.$el = null;

    /*
        html template, must be encapsulated in a tag element (div or other)
     */
    this.template = options.template || '';

    /*
        html template function from doT
     */
    this.templateFn = null;

    /*
        data for template
     */
    this.data = options.data || {};

    /*
        components of view
     */
    this.components = options.components || {};
    this._componentsInstances = [];

    /*
        Data observer for rerendering when necessary
        LA VIOLENCE !!!
        Pour plus tard on va essayer de stocker des 'micros bouts de templates'
        puis on render uniquement les micros bouts en fonction de quel data à été updated
     */
    observer.watch(this.data, this.render.bind(this));


    // When ready launch first render
    this.compile();
    this.render();
}

// Make View an event emitter
inherits(View, Emitter);

/*========================================================
    PUBLIC API
========================================================*/
/**
 * Append (add at end) the view to a DOM element
 * @param  {DOMElement} domElement - Element where to append view
 */
View.prototype.appendTo = function(domElement) {
    if (!domElement.tagName) {
        console.warn('[View] appendTo() - param must be a DOMElement')
        return;
    }
    this.$parentEl = domElement;
    this.$parentEl.appendChild(this.$el);
    this._ready();
};

/**
 * Prepend (add at beginning) the view to a DOM element
 * @param  {DOMElement} domElement - Element where to append view
 */
View.prototype.prependTo = function(domElement) {
    if (!domElement.tagName) {
        console.warn('[View] appendTo() - param must be a DOMElement')
        return;
    }
    this.$parentEl = domElement;
    this.$parentEl.insertBefore(this.$el, this.$parentEl.firstChild);
    this._ready();
};

/**
 * Compile Template string (this.template) to a template function to
 * use for render (this.templateFn)
 */
View.prototype.compile = function() {
    this.templateFn = renderer.compile(this.template);
    this._compiled();
};

View.prototype.appendComponents = function() {
    this._componentsInstances = [];
    walk(this.$el, function(node) {
        if (node.nodeType === 1) {
            var cTor = this.components[node.nodeName.toLowerCase()];
            if (cTor !== undefined) {
                var data = domUtils.attributesToData(node);
                var component = new cTor(data);
                console.log(component);
                this._componentsInstances.push(component);
                node.parentNode.replaceChild(component.$el, node);
            }
        }
    }.bind(this));
};

/**
 * Use template function to create DOM Element populated from view datas
 */
View.prototype.render = function() {
    var $el = renderer.render(this.templateFn, this.data);
    if (this.$parentEl && this.$el) {
        this.$parentEl.replaceChild($el, this.$el);
    }
    this.$el = $el;
    this.appendComponents();
    this._rendered();
};

/*========================================================
    LIFECYCLE
========================================================*/
/**
 * When the view has its template function ready
*/
View.prototype.compiled = function() {}; // to override if you want
View.prototype._compiled = function() {
    this.compiled();
    this.emit('compiled');
    // console.log('compiled');
};

/**
 * When the view has its template rendered into a populated domElement (this.$el)
*/
View.prototype.rendered = function() {}; // to override if you want
View.prototype._rendered = function() {
    this.rendered();
    this.emit('rendered');
    // console.log('rendered');
};

/**
 * When the view has been added to the document, recursively calls ready function from all child
 * components so that the current view ready function is called last. Ex;
 *     - childComponent1.ready
 *     - childComponent2.ready
 *     - this.ready
*/
View.prototype.ready = function() {}; // to override if you want
View.prototype._ready = function() {
    forEach(this._componentsInstances, function(value, index) {
        value._ready();
    });
    this.ready();
    this.emit('ready');
    // console.log('ready');
};

module.exports = View;