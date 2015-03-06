'use strict';

// var renderer = require('base/renderer');
var domUtils = require('base/utils/dom');
var Q = require('q');
var domify = require('domify');
var Emitter = require('emitter-component');
var forEach = require('for-each');
var bindAll = require('bindall-standalone');
var verbose = require('config').verbose;
var walk = require('dom-walk');
var observer = require('watchjs');
var inherits = require('inherits');

/**
 * class View
 * Every view, layout and component herit this class
 */
function View(options) {
    options = options || {};

    /*
        Compiled Dom (domthing) object of the view
     */
    this.$el = null;

    /*
        html template function from domthing
     */
    this.templateFn = options.template;

    /*
        Array of promises to be resolved before the view start transitioning
     */
    this.resolve = options.resolve;

    /*
        The result of promises given in resolve
     */
    this.resolvedFiles = {};

    /*
        data for template
     */
    this.model = options.model || {};

    /*
        components of view
     */
    this.compose = options.compose || {};
    this.componentsInstances = [];

    /*
        reference to view's components
     */
    this.refs = {};

    // Bind context to sensitive methods
    bindAll(this, 'dataUpdated', 'render', 'onTransitionInComplete', 'onTransitionOutComplete', '_onTransitionInComplete', '_onTransitionOutComplete', '_resolved');

    /*
        Data observer for rerendering when necessary
        LA VIOLENCE !!!
        Pour plus tard on va essayer de stocker des 'micros bouts de templates'
        puis on render uniquement les micros bouts en fonction de quel data à été updated
     */
    observer.watch(this.model, this.dataUpdated);

    // When ready launch first render
    // this.compile();
    this.render();
    this.startResolve();
}

// Make View an event emitter
inherits(View, Emitter);

/*========================================================
    PUBLIC API
========================================================*/
View.prototype.createTemplateFromString = function(templateString) {

};

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
    observer.unwatch(this.model, this.render);
    forEach(this.componentsInstances, function(value, index) {
        value.destroy();
    });
    this._destroying();
    this._destroyed();
};

/**
 * Parse view dom to check if we need to add child Views (components)
 */
View.prototype.appendComponents = function() {
    this.componentsInstances = [];
    walk(this.$el, function(node) {
        if (node.nodeType === 1) {
            var Ctor = this.compose[node.nodeName.toLowerCase()];
            if (Ctor !== undefined) {
                var data = domUtils.attributesToData(node);
                console.log('dataCtor', data);
                var r;
                if(data.ref) {
                    r = data.ref;
                    delete data.ref; // delete ref to don't inject it in data
                }
                var component = new Ctor(data);
                if(r) {
                    this.refs[r] = component;
                }
                this.componentsInstances.push(component);
                node.parentNode.replaceChild(component.$el, node);
            }
        }
    }.bind(this));
    if(this.componentsInstances.length) {
        console.log('instances', this.componentsInstances, this.componentsInstances[0] === this.componentsInstances[1]);
    }
};

/**
 * Use template function to create DOM Element populated from view model
 */
View.prototype.render = function() {
    this.$el = this.templateFn(this.model);
    console.log('Render', this.$el);

    this.appendComponents();
    // this._rendered();
};

View.prototype.startResolve = function() {
    if(!this.resolve) return;

    var promises = [];

    for(var i in this.resolve) {
        promises.push(this.resolve[i]);
    }

    return Q.all(promises).then(this._resolved);
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
View.prototype.dataUpdated = function(prop, action, difference, oldvalue) {
    // console.log('dataUpdated', arguments);
    if(this.$el) {
        this.$el.update(prop, this.model[prop]);
    }
    forEach(this.componentsInstances, function(value, index) {
        // console.log('component', value.model, prop, value.model['prop']);
    });

    if(this.componentsInstances.length) {
        // this.componentsInstances[0].$el.update('title', 'yoyouooyuyo');
        this.componentsInstances[0].model.title = 'wesh';
        console.log(this.componentsInstances[0].model, this.componentsInstances[1].model, this.componentsInstances[0].model === this.componentsInstances[1].model);
        // this.componentsInstances[1].model.title = '######';
    }
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
    forEach(this.componentsInstances, function(value, index) {
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

View.prototype.resolved = function() {};
View.prototype._resolved = function(data) {
    if(data.length === 0) return;

    var j = 0;
    for(var i in this.resolve) {
        this.resolvedFiles[i] = data[j];
        j++;
    }

    console.log('Resolved', this.resolvedFiles);
    this.resolved();
    this.emit('resolved');
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