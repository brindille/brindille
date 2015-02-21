var Section = require('lib/Section');
var fs = require('fs');
var TweenMax = require('TweenMax');

var home = new Section({
    template: fs.readFileSync(__dirname + '/home.html', 'utf8'),
    data: {
        'name': 'John'
    }
});

home.transitionIn = function (callback) {
    var $els = [
        document.querySelector('.home h1'),
        document.querySelector('.home h2'),
        document.querySelector('.home a')
    ];

    this.tlTransition  = new TimelineMax({
        onComplete: callback
    });
    this.tlTransition.staggerFromTo($els, 0.7, {y: 100, alpha: 0}, {y: 0, alpha: 1, ease: Expo.easeInOut}, 0.08, 0);
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

};

home.removeEvents = function () {

};

// add your own methods here
// e.g: home.action = function() {};

module.exports = home;