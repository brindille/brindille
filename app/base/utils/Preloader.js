'use strict';

var bindAll = require('bindall-standalone');
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

    bindAll(this, 'load', '_handleProgress', '_handleComplete', 'getImage', 'getSound', 'getVideo');
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
    this._loader.addCompletionListener(this._handleComplete);
    this._loader.addProgressListener(this._handleProgress);

    for(var i = 0, l = manifest.length; i < l; i++) {
        if(manifest[i].src.match(IMAGE_PATTERN)) this.addImage(manifest[i]);
        if(manifest[i].src.match(SOUND_PATTERN)) this.addSound(manifest[i]);
        if(manifest[i].src.match(VIDEO_PATTERN)) this.addVideo(manifest[i]);
    }

    this._loader.start();
    return this;
};

Preloader.prototype.addImage = function(infos) {
    this.imagesContent[infos.id] = this._loader.addImage(infos.src, infos.id, infos.priority, infos.origin);
};

Preloader.prototype.addSound = function(infos) {
    this.soundsContent[infos.id] = this._loader.addSound(infos.id, infos.src, null, infos.priority);
};

Preloader.prototype.addVideo = function(infos) {
    this.videosContent[infos.id] = this._loader.addVideo(infos.src, infos.id, infos.priority, infos.origin);
};

Preloader.prototype._handleProgress = function(e) {
    if(e.error || e.timeout) {
        this.handleError(e);
        return;
    }

    this.emit('preload:progress', e);
};

Preloader.prototype.handleError = function(e) {
    this._deferred.reject();
    this.emit('preload:error', e);
};

Preloader.prototype._handleComplete = function(e) {
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
    this.emit('preload:complete', res);
};

Preloader.prototype.getPromise = function() {
    return this._deferred.promise;
};

Preloader.prototype.getImage = function(id) {
    return this.imagesContent[id];
};

Preloader.prototype.getSound = function(id) {
    return this.soundsContent[id];
};

Preloader.prototype.getVideo = function(id) {
    return this.videosContent[id];
};

module.exports = new Preloader();