'use strict';

var View = require('./View'),
    EventEmitter = require('events').EventEmitter,
    PxLoader = require('PxLoader'),
    forEach = require('forEach'),
    TweenMax = require('TweenMax');

/*
    Section class
    Manage each view with data, template and actions given
 */
function Section (options) {
    View.call(this);

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
}

Section.prototype = new View; // jshint ignore:line
Section.prototype.constructor = Section;

Section.prototype.routed = function() {
    this.createPromises();
    this.resolvePromises().then(function() {
        this.createManifest();
        this.startPreload();
    }.bind(this));
};

/************************
 *  Transition stuff
 ************************/
Section.prototype.transitionIn = function(callback) {
    console.warn('[Section] - You can override section.transitionIn to have a custom transition in');
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

Section.prototype.transitionOut = function(callback) {
    console.warn('[Section] - You can override section.transitionOut to have a custom transition out');
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

/************************
 *  Promises stuff
 ************************/
/*
    Push promises to the promises array
    They will be resolved and parsed
    eg. this.promises.push({id: 'products', promise: productsApi.getProducts()})
*/
Section.prototype.createPromises = function() {
    // Method to override
    console.warn('[Section] - You need to override section.createPromises');
};

Section.prototype.resolvePromises = function() {
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
Section.prototype.createManifest = function() {
    // Method to override
    console.warn('[Section] - You need to override section.createManifest');
};

Section.prototype.startPreload = function() {
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
Section.prototype.onPreloadProgress = function(event) {
    if(event.error) {
        this.onPreloadError();
        return;
    }

    var progress = event.completedCount/event.totalCount;
    this.emitter.emit('section:preloadProgress', progress);
};

Section.prototype.onPreloadError = function(event) {
    this.emitter.emit('section:preloadError');
};

/*
    Handle preload completion
    e.g. stop loading animation and display content
 */
Section.prototype.onPreloadComplete = function() {
    // Method to override
    console.warn('[Section] - You need to override section.onPreloadComplete');
};

Section.prototype.contentLoaded = function() {
    if(this.preloader) {
        this.preloader = null;
    }
    this.onPreloadComplete();
    this.transitionIn();
};

module.exports = Section;