'use strict';

var Q = require('q');
var domify = require('domify');
var Emitter = require('emitter-component');
var forEach = require('for-each');
var bindAll = require('bindall-standalone');
var verbose = require('config').verbose;
var walk = require('dom-walk');
var observer = require('watchjs');
var inherits = require('inherits');
var clone = require('clone');

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
    this.bindFunctions = [];

    /*
        reference to view's components
     */
    this.refs = {};

    // Bind context to sensitive methods
    bindAll(this, 'render', 'onTransitionInComplete', 'onTransitionOutComplete', '_onTransitionInComplete', '_onTransitionOutComplete');

    /*
        Data observer for repopulating when necessary
     */
    observer.watch(this.model, _updated.bind(this));

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
    _ready.call(this);
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
    _ready.call(this);
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
    observer.unwatch(this.model, _updated.bind(this));
    forEach(this.bindFunctions, function(value, index) {
        observer.unwatch(this.model, value.source, value.fn);
    }.bind(this));
    forEach(this.componentsInstances, function(value, index) {
        value.destroy();
    });
    _destroying.call(this);
    _destroyed.call(this);
};

/**
 * Parse view dom to check if we need to add child Views (components)
 */
View.prototype.appendComponents = function() {
    this.componentsInstances = [];

    walk(this.$el, function(node) {
        if (node.nodeType === 1) {
            // Get Component constructor
            var Ctor = this.compose[node.nodeName.toLowerCase()];
            if (Ctor === undefined) return;

            var attributes = node.attributes;
            var model = {};
            var binders = [];
            var bindId;
            var r;
            var component;

            // Inject component attributes to its model and save binders attribute if needed
            forEach(attributes, function(value, index) {
                if(value.name === undefined) return;
                if(value.name.indexOf('bind-') === 0) {
                    bindId = value.name.replace('bind-', '');
                    model[bindId] = this.model[value.value];
                    binders.push({source: value.value, target: bindId});
                }
                else {
                    model[value.name] = value.value;
                }
            }.bind(this));

            // Special attribute ref is used to keep a ref of the component to the current view
            if(model.ref) {
                r = model.ref;
                delete model.ref; // delete ref to don't inject it in model
            }

            // Create the component instance
            component = new Ctor(model);

            // Bind / watch attributes that need it from this view model to the component model
            forEach(binders, function(value, index) {
                // We keep a reference to the binding function to unwatch on destroy
                var binding = {
                    fn: function() {
                        component.model[value.target] = this.model[value.source];
                    }.bind(this),
                    source: value.source
                };
                observer.watch(this.model, binding.source, binding.fn);
                this.bindFunctions.push(binding);
            }.bind(this));

            // Save component reference if ref attribute was specified
            if(r) {
                this.refs[r] = component;
            }

            // Save component instance
            this.componentsInstances.push(component);

            // Inject component dom to view dom
            node.parentNode.replaceChild(component.$el, node);

        }
    }.bind(this));
};

/**
 * Use template function to create DOM Element populated from view model
 */
View.prototype.render = function() {
    this.$el = this.templateFn(this.model);
    this.appendComponents();
    _rendered.call(this);
};

View.prototype.parentIsReady = function() {
    _ready.call(this);
};

View.prototype.startResolve = function() {
    if(!this.resolve) return;

    var promises = [];

    for(var i in this.resolve) {
        promises.push(this.resolve[i]);
    }

    return Q.all(promises).then(_resolved.bind(this));
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
View.prototype.updated = function(prop, action, difference, oldvalue) {}; // to override if you want
function _updated(prop, action, difference, oldvalue) {
    if(this.$el) {
        this.$el.update(prop, this.model[prop]);
    }
    this.updated(prop, action, difference, oldvalue);
    this.emit('updated');
}

/**
 * When the view has its template rendered into a populated domElement (this.$el)
*/
View.prototype.rendered = function() {}; // to override if you want
function _rendered() {
    this.rendered();
    this.emit('rendered');
}

/**
 * When the view has been added to the document, recursively calls ready function from all child
 * components so that the current view ready function is called last. Ex;
 *     - childComponent1.ready
 *     - childComponent2.ready
 *     - this.ready
*/
View.prototype.ready = function() {}; // to override if you want
function _ready() {
    forEach(this.componentsInstances, function(value, index) {
        value.parentIsReady();
    });
    this.ready();
    this.emit('ready');
};

/**
 * The moment you want to kill eventListeners, raf, tweens etc..
*/
View.prototype.destroying = function() {};
function _destroying() {
    this.destroying();
    this.emit('destroying');
};

/**
 * Here everything should be clean and ready for GC
*/
View.prototype.destroyed = function() {};
function _destroyed() {
    this.destroyed();
    this.emit('destroyed');
};

View.prototype.resolved = function() {};
function _resolved(data) {
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