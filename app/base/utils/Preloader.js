'use strict';

var PxLoader = require('PxLoader');
var inherits = require('inherits');
var Emitter = require('emitter-component');
var Q = require('q');

// regexp to know which kind of file is in manifest
var IMAGE_PATTERN = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/gi;
var VIDEO_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp4|mov|webm|ogv))/gi;
var SOUND_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp3|wav))/gi;


function Preloader() {
    this._loader = new PxLoader();
    this._deferred = Q.defer();
    this.imagesContent = [];
    this.soundsContent = [];
    this.videosContent = [];
}
// Make preloader an event emitter
inherits(Preloader, Emitter);

/**
 * Load manifest using PxLoader
 * @param  {array} manifest array of object added to manifest
 *                          following this structure:
 *                          {id: 'someId', src: 'myUrl', priority: 0, origin:  'anonymous'}
 */
Preloader.prototype.load = function(manifest) {
    this._loader.addCompletionListener(_handleComplete.bind(this));
    this._loader.addProgressListener(_handleProgress.bind(this));

    for(var i = 0, l = manifest.length; i < l; i++) {
        if(manifest[i].src.match(IMAGE_PATTERN)) this.addImage(manifest[i]);
        if(manifest[i].src.match(SOUND_PATTERN)) this.addSound(manifest[i]);
        if(manifest[i].src.match(VIDEO_PATTERN)) this.addVideo(manifest[i]);
    }

    this._loader.start();
    return this;
};

/**
 * Return promise for projects based on it
 * @return {Promise}
 */
Preloader.prototype.getPromise = function() {
    return this._deferred.promise;
};

/**
 * Add image to preload
 * @param {Object} infos object following manifest object structure (see above)
 */
Preloader.prototype.addImage = function(infos) {
    this.imagesContent[infos.id] = this._loader.addImage(infos.src, infos.id, infos.priority, infos.origin);
};

/**
 * Find image desired
 * @param  {String} id image name
 * @return {Image}
 */
Preloader.prototype.getImage = function(id) {
    return this.imagesContent[id];
};

/**
 * Add sound to preload
 * @param {Object} infos object following manifest object structure (see above)
 */
Preloader.prototype.addSound = function(infos) {
    this.soundsContent[infos.id] = this._loader.addSound(infos.id, infos.src, null, infos.priority);
};

/**
 * Find sound desired
 * @param  {String} id sound name
 * @return {Image}
 */
Preloader.prototype.getSound = function(id) {
    return this.soundsContent[id];
};

/**
 * Add video to preload
 * @param {Object} infos object following manifest object structure (see above)
 */
Preloader.prototype.addVideo = function(infos) {
    this.videosContent[infos.id] = this._loader.addVideo(infos.src, infos.id, infos.priority, infos.origin);
};

/**
 * Find video desired
 * @param  {String} id video name
 * @return {Image}
 */
Preloader.prototype.getVideo = function(id) {
    return this.videosContent[id];
};

/**
 * Handle preload progression
 * @param  {Object} e
 */
function _handleProgress (e) {
    if(e.error || e.timeout) {
        _handleError.call(this, e);
        return;
    }

    this.emit('progress', e);
}

/**
 * Handle preload errors and reject promise
 * @param  {Object} e
 */
function _handleError (e) {
    this._deferred.reject();
    this.emit('error', e);
}

/**
 * Handle preload complete and resolve promise
 * @param  {Object} e
 */
function _handleComplete (e) {
    var res = [];

    for(var i in this.imagesContent) {
        res[i] = this.imagesContent[i];
    }

    for(var j in this.soundsContent) {
        res[j] = this.soundsContent[j];
    }

    for(var k in this.videosContent) {
        res[k] = this.videosContent[k];
    }

    this._deferred.resolve(res);
    this.emit('complete', res);
}

module.exports = new Preloader();