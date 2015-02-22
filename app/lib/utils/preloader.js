'use strict';

var bindAll = require('bindall-standalone'),
    PxLoader = require('PxLoader'),
    verbose = require('app/config').verbose;

var preloader = {
    opts: undefined,
    loader: new PxLoader(),
    imagesContent: [],
    soundsContent: [],
    videosContent: [],

    load: function(opts) {
        if(verbose) console.debug('[Preloader] Start with root :', opts.root);
        this.opts = opts;
        this.loader.addCompletionListener(this.handleComplete);
        this.loader.addProgressListener(this.handleProgress);
        for(var i = 0, l = opts.manifest.length; i < l; i++) {
            if(opts.manifest[i].type === 'image') this.addImage(opts.manifest[i]);
            if(opts.manifest[i].type === 'sound') this.addSound(opts.manifest[i]);
            if(opts.manifest[i].type === 'video') this.addVideo(opts.manifest[i]);
        }
        this.loader.start();
    },

    addImage: function(infos) {
        this.imagesContent[infos.id] = this.loader.addImage(this.opts.root + infos.src, infos.id, null, '');
    },

    addSound: function(infos) {
        this.soundsContent[infos.id] = this.loader.addSound(infos.id, this.opts.root + infos.src);
    },

    addVideo: function(infos) {
        this.videosContent[infos.id] = this.loader.addVideo(this.opts.root + infos.src, infos.id);
    },

    handleProgress: function(e) {
        if(e.error || e.timeout) {
            this.handleError(e);
            return;
        }

        this.opts.handleProgress(e);
    },

    handleError: function(e) {
        this.opts.handleError(e);
    },

    handleComplete: function(e) {
        this.opts.handleComplete(e);
    },

    getImage: function(id) {
        return this.imagesContent[id];
    },

    getSound: function(id) {
        return this.soundsContent[id];
    },

    getVideo: function(id) {
        return this.videosContent[id];
    }
};

bindAll(preloader, 'load', 'handleProgress', 'handleComplete', 'getImage', 'getSound', 'getVideo');

module.exports = preloader;