'use strict';

var View = require('./View'),
    EventEmitter = require('events').EventEmitter,
    Promise = require('promise'),
    preloader = require('utils/preloader'),
    forEach = require('forEach'),
    TweenMax = require('TweenMax'),
    config= require('app/config');

/**
 * class Section extends View
 * Manage each view with data, template and actions given
 * @param {object} options
 */
function Section (options) {
    View.call(this);

    /*
        html template
     */
    this.template = options.template || '';
    /*
       data for template
     */
    this.data = options.data || {};
    /*
        parameters coming from route path
     */
    this.params = {};
    /*
        event emitter
     */
    this.emitter = new EventEmitter();
    /*
       manifest to preload
     */
    this.manifest = [];
    /*
       promises to resolve
     */
    this.promises = [];
    /*
        promises results
     */
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

/*===================================================
   Transitions
===================================================*/
/**
 * Animation to play when section is appended
 * @param  {Function} callback function to execute whenever you want (onStart, onComplete, ...)
 */
Section.prototype.transitionIn = function(callback) {
    if(config.verbose) console.info('[Section] - You can override section.transitionIn to have a custom transition in');
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

/**
 * Animation to play when section is destroyed
 * @param  {Function} callback function to execute on transition complete
 * @return {[type]}            [description]
 */
Section.prototype.transitionOut = function(callback) {
    if(config.verbose) console.info('[Section] - You can override section.transitionOut to have a custom transition out');
    if (callback && typeof(callback) === "function") {
        callback();
    }
};

/*===================================================
   Promises
===================================================*/
/**
 * Push promises to the promises array
 * They will be resolved and parsed
 * eg. this.promises.push({id: 'products', promise: productsApi.getProducts()})
 */
Section.prototype.createPromises = function() {
    // Method overridable
    if(config.verbose) console.info('[Section] - Override section.createPromises to resolve your promises');
};

/**
 * Resolve all promises and save results in this.files
 */
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

/*===================================================
   Preload
===================================================*/
/**
 * Push files URL into the manifest array
 * eg. this.manifest.push(URL)
 */
Section.prototype.createManifest = function() {
    // Method overridable
    if(config.verbose) console.info('[Section] - You can override section.createManifest to preload some files');
};

/**
 * Add files to preloader
 */
Section.prototype.startPreload = function() {
    if(this.manifest && this.manifest.length > 0) {
        preloader.load({
            root: config.assetsRoot,
            manifest: this.manifest,
            handleProgress: this.onPreloadProgress.bind(this),
            handleError: this.onPreloadError.bind(this),
            handleComplete: this.contentLoaded.bind(this)
        });
    }
    else {
        this.contentLoaded();
    }
};

/**
 * Handle preload progretion
 * progress = progretion between [0 - 1]
 * @param  {object} event status of progression
 */
Section.prototype.onPreloadProgress = function(event) {
    var progress = event.completedCount/event.totalCount;
    this.emitter.emit('section:preloadProgress', progress);
};

/**
 * Handle preload error
 */
Section.prototype.onPreloadError = function(event) {
    this.emitter.emit('section:preloadError');
};

/**
 * Play transition in when preload ended
 */
Section.prototype.contentLoaded = function() {
    this.onPreloadComplete();
    this.transitionIn();
};

/**
 * Handle preload completion
 * e.g. stop loading animation and display content
 */
Section.prototype.onPreloadComplete = function() {
    // Method overridable
    if(config.verbose) console.info('[Section] - You can override section.onPreloadComplete to handle preload completion');
};


module.exports = Section;