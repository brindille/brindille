'use strict';

var Section = require('lib/Section');
var fs = require('fs');
var resizeUtil = require('brindille-resize');
var bindAll = require('bindall-standalone');

var home = new Section({
    template: require('./home.html'),
    data: {
        name: 'John'
    },
    components: {
        test: {
            componentId: 'component-test',
            data: {
                url: 'http://perdu.com',
                label: 'test from home'
            }
        }
    }
});

home.ready = function () {
    var $els = [
        document.querySelector('.home h1'),
        document.querySelector('.home h2'),
        document.querySelector('.home a')
    ];
    this.tlTransition = new TimelineMax();
    this.tlTransition.staggerFromTo($els, 0.7, {y: 100, alpha: 0}, {y: 0, alpha: 1, ease: Expo.easeInOut}, 0.08, 0);
    this.tlTransition.pause(0);
};

home.beforeDestroy = function () {
    this.tlTransition = null;
};

home.transitionIn = function (callback) {
    this.tlTransition.eventCallback('onComplete', callback);
    this.tlTransition.play(0);
};

home.transitionOut = function(callback) {
    this.tlTransition.eventCallback('onReverseComplete', callback);
    this.tlTransition.reverse();
};

home.onPreloadComplete = function() {

};

home.createPromises = function() {

};

home.createManifest = function() {

};

home.addEvents = function () {
    resizeUtil.addListener(this.resize);
};

home.removeEvents = function () {
    resizeUtil.removeListener(this.resize);
};

home.resize = function() {
    console.log('resize', resizeUtil.width, resizeUtil.height);
};

// add your own methods here
// e.g: home.action = function() {};

bindAll(home, 'resize');

module.exports = home;