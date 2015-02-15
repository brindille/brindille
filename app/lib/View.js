'use strict';

var AbstractView = require('./AbstractView'),
    EventEmitter = require('events').EventEmitter,
    PxLoader = require('PxLoader'),
    forEach = require('forEach'),
    TweenMax = require('TweenMax');

/*
    View class
    Manage each view with data, template and actions given
 */
function View (options) {
    // html template
    this.template = options.template || '';
    // data for template
    this.data = options.data || {};
    // event emitter
    this.emitter = new EventEmitter();
    // manifest to preload
    this.manifest = [];
    // promises to resolve
    this.promises = [];
    // promises results
    this.files = {};
    // transition timeline
    this.tlTransition = null;
    // transition mode
    this.transitionType = options.transitionType || '';
}

View.prototype = new AbstractView; // jshint ignore:line
View.prototype.constructor = View;

View.prototype.routed = function() {
    this.setTimeline();
    this.createPromises();
    this.resolvePromises().then(function() {
        this.createManifest();
        this.startPreload();
    }.bind(this));
};

/************************
 *  Transition stuff
 ************************/

View.prototype.setTimeline = function() {
    // main timeline
    this.tlTransition = new TimelineMax({
        onComplete: this.onTransitionInComplete,
        onCompleteScope: this,
        onReverseComplete: this.onTransitionOutComplete,
        onReverseCompleteScope: this,
        paused: true
    });
};
/*
    Actions to execute before transitionIn start (e.g: resize elements)
 */
View.prototype.beforeTransitionIn = function() {
    // Method to override
    console.warn('[View] - You need to override view.beforeTransitionIn');
};

/*
    Play view transition in
 */
View.prototype.playTransitionIn = function() {
    this.tlTransition.play();
};

/*
    Play view transition out
 */
View.prototype.playTransitionOut = function() {
    this.tlTransition.reverse();
};

/*
    Add tweens to transition timeline
 */
View.prototype.insertTweens = function() {
    // Method to override
    console.warn('[View] - You need to override view.insertTweens');
    this.tlTransition.fromTo(document.body, 0.4, {opacity: 0}, {opacity: 1});
};

/*
    When transition in has finished
 */
View.prototype.onTransitionInComplete = function() {
    this.emitter.emit('view:transitionInComplete');
};

/*
    When transition out has finished
 */
View.prototype.onTransitionOutComplete = function() {
    this.emitter.emit('view:transitionOutComplete');
};

/************************
 *  Promises stuff
 ************************/
/*
    Push promises to the promises array
    They will be resolved and parsed
    eg. this.promises.push({id: 'products', promise: productsApi.getProducts()})
*/
View.prototype.createPromises = function() {
    // Method to override
    console.warn('[View] - You need to override view.createPromises');
};

View.prototype.resolvePromises = function() {
    var promisesManifest = [],
        promisesResult = {};

    // Parse each promise result for any image URL
    forEach(this.promises, function(promise) {
        promise.promise.then(function(result){
            this.files[promise.id] = result;
        }.bind(this));
    }, this);

    // Start preload when all promises are resolved and parsed
    return Promise.all(this.promises.map(function(item){
        return item.promise;
    }));
};

/************************
 *  Preload stuff
 ************************/
/*
    Push files URL into the manifest array
    eg. this.manifest.push(URL)
*/
View.prototype.createManifest = function() {
    // Method to override
    console.warn('[View] - You need to override view.createManifest');
};

View.prototype.startPreload = function() {
    if(this.manifest && this.manifest.length > 0) {
        this.preloader = new PxLoader();
        forEach(this.manifest, function (img, i) {
            this.preloader.addImage(img);
        }.bind(this));
        this.preloader.addProgressListener(this.onPreloadProgress.bind(this));
        this.preloader.addCompletionListener(this.contentLoaded.bind(this));
        this.preloader.start();
    }
    else {
        this.contentLoaded();
    }
};

/*
    Handle preload progretion
    progress = progretion between [0 - 1]
 */
View.prototype.onPreloadProgress = function(event) {
    if(event.error) {
        this.onPreloadError();
        return;
    }

    var progress = event.completedCount/event.totalCount;
    this.emitter.emit('view:preloadProgress', progress);
};

View.prototype.onPreloadError = function(event) {
    this.emitter.emit('view:preloadError');
};

/*
    Handle preload completion
    e.g. stop loading animation and display content
 */
View.prototype.onPreloadComplete = function() {
    // Method to override
    console.warn('[View] - You need to override view.onPreloadComplete');
};

View.prototype.contentLoaded = function() {
    if(this.preloader) {
        this.preloader = null;
    }
    this.beforeTransitionIn();
    this.onPreloadComplete();
    this.insertTweens();
};

module.exports = View;