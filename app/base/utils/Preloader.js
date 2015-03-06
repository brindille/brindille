'use strict';

var bindAll = require('bindall-standalone');
var PxLoader = require('PxLoader');
var config = require('config');
var inherits = require('inherits');
var Emitter = require('emitter-component');
var Q = require('q');

// regexp to know which kind of file is in manifest
var IMAGE_PATTERN = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/gi;
var VIDEO_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp4|mov|webm|ogv))/gi;
var SOUND_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp3|wav))/gi;


function Preloader() {
    this.assetsRoot = config.assetsRoot || '';
    this.loader = new PxLoader();
    this.deferred = Q.defer();
    this.imagesContent = [];
    this.soundsContent = [];
    this.videosContent = [];

    bindAll(this, 'load', 'handleProgress', 'handleComplete', 'getImage', 'getSound', 'getVideo');
}
// Make preloader an event emitter
inherits(Preloader, Emitter);

/**
 * Load manifest using PxLoader
 * @param  {array} manifest array of object add to manifest
 *                          following this structure: {id: 'somId', src: 'myUrl'}
 */
Preloader.prototype.load = function(manifest) {
    if(config.verbose) console.debug('[Preloader] Start with root :', this.assetsRoot);
    this.loader.addCompletionListener(this.handleComplete);
    this.loader.addProgressListener(this.handleProgress);
    for(var i = 0, l = manifest.length; i < l; i++) {
        if(manifest[i].src.match(IMAGE_PATTERN)) this.addImage(manifest[i]);
        if(manifest[i].src.match(SOUND_PATTERN)) this.addSound(manifest[i]);
        if(manifest[i].src.match(VIDEO_PATTERN)) this.addVideo(manifest[i]);
    }
    this.loader.start();
    return this;
};

Preloader.prototype.addImage = function(infos) {
    this.imagesContent[infos.id] = this.loader.addImage(this.assetsRoot + infos.src, infos.id, null, '');
};

Preloader.prototype.addSound = function(infos) {
    this.soundsContent[infos.id] = this.loader.addSound(infos.id, this.assetsRoot + infos.src);
};

Preloader.prototype.addVideo = function(infos) {
    this.videosContent[infos.id] = this.loader.addVideo(this.assetsRoot + infos.src, infos.id);
};

Preloader.prototype.handleProgress = function(e) {
    if(e.error || e.timeout) {
        this.handleError(e);
        return;
    }

    this.emit('preload:progress', e);
};

Preloader.prototype.handleError = function(e) {
    this.deferred.reject();
    this.emit('preload:error', e);
};

Preloader.prototype.handleComplete = function(e) {
    var res = this.imagesContent.concat(this.soundsContent, this.videosContent);
    this.deferred.resolve(res);
    this.emit('preload:complete', e);
};

Preloader.prototype.getPromise = function() {
    return this.deferred.promise;
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