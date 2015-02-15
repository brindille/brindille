var View = require('lib/View');
var fs = require('fs');
var TweenMax = require('TweenMax');

var about = new View({
    template: fs.readFileSync(__dirname + '/about.html', 'utf8'),
    data: {
        'title': 'About'
    },
    transitionType: 'outAndAfterIn'
});

about.insertTweens = function () {
    var $el = document.querySelector('.about h1');
    this.tlTransition.fromTo($el, 0.7, {y: 100, alpha: 0}, {y: 0, alpha: 1, ease: Expo.easeInOut}, 0.3);
};

about.beforeTransitionIn = function () {

};

about.onPreloadComplete = function() {

};

about.createPromises = function() {

};

about.createManifest = function() {

};

about.addEvents = function () {

};

about.removeEvents = function () {

};

// add your own methods here
// e.g: about.action = function() {};

module.exports = about;