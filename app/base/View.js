'use strict';

var renderer = require('base/renderer'),
    domUtils = require('base/utils/dom'),
    Emitter = require('emitter-component'),
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
        html string template, must be encapsulated in a single tag element (div or other)
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

    // Bind context to sensitive methods
    bindAll(this, 'render', 'onTransitionInComplete', 'onTransitionOutComplete');

    /*
        Data observer for rerendering when necessary
        LA VIOLENCE !!!
        Pour plus tard on va essayer de stocker des 'micros bouts de templates'
        puis on render uniquement les micros bouts en fonction de quel data à été updated
     */
    observer.watch(this.data, this.render);


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
        console.warn('[View] appendTo() - param must be a DOMElement');
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
        console.warn('[View] appendTo() - param must be a DOMElement');
        return;
    }
    this.$parentEl = domElement;
    this.$parentEl.insertBefore(this.$el, this.$parentEl.firstChild);
    this._ready();
};

/**
 * Remove view from parent and start destroy process
 */
View.prototype.remove = function() {
    if(this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
    }
    this.destroy();
};

/**
 * Destroying the view and its child components
 */
View.prototype.destroy = function() {
    observer.unwatch(this.data, this.render);
    forEach(this._componentsInstances, function(value, index) {
        value.destroy();
    });
    this._destroying();
    this._destroyed();
};

/**
 * Compile Template string (this.template) to a template function to
 * use for render (this.templateFn)
 */
View.prototype.compile = function() {
    this.templateFn = renderer.compile(this.template);
    this._compiled();
};

/**
 * Parse view dom to check if we need to add child Views (components)
 */
View.prototype.appendComponents = function() {
    this._componentsInstances = [];
    walk(this.$el, function(node) {
        if (node.nodeType === 1) {
            var Ctor = this.components[node.nodeName.toLowerCase()];
            if (Ctor !== undefined) {
                var data = domUtils.attributesToData(node);
                var component = new Ctor(data);
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

View.prototype.transitionIn = function() {
    this.onTransitionInComplete();
};

View.prototype.transitionOut = function() {
    this.onTransitionOutComplete();
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
};

/**
 * When the view has its template rendered into a populated domElement (this.$el)
*/
View.prototype.rendered = function() {}; // to override if you want
View.prototype._rendered = function() {
    this.rendered();
    this.emit('rendered');
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
};

/**
 * The moment you want to kill eventListeners, raf, tweens etc..
*/
View.prototype.destroying = function() {};
View.prototype._destroying = function() {
    this.destroying();
    this.emit('destroying');
};

/**
 * Here everything should be clean and ready for GC
*/
View.prototype.destroyed = function() {};
View.prototype._destroyed = function() {
    this.destroyed();
    this.emit('destroyed');
};

View.prototype.onTransitionInComplete = function() {};
View.prototype._onTransitionInComplete = function() {
    this.onTransitionInComplete();
    this.emit('onTransitionInComplete');
};

View.prototype.onTransitionOutComplete = function() {};
View.prototype._onTransitionOutComplete = function() {
    this.onTransitionOutComplete();
    this.emit('onTransitionOutComplete');
};

module.exports = View;