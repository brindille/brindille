var Factory = require('base/utils/factory');

var about = Factory.viewInstance({
    template: require('./about.dom'),
    model: {
        title: 'About'
    },
    resolve: {},
    compose: {}
});

about.transitionIn = function(onCompleteCallback) {
    var tl = new TimelineMax({
        onComplete: onCompleteCallback
    });
    tl.fromTo(this.$el, 0.4, {alpha: 0, y: 150}, {alpha: 1, y: 0, ease: Expo.easeInOut});
};

about.transitionOut = function(onCompleteCallback) {
    var tl = new TimelineMax({
        onComplete: onCompleteCallback
    });
    tl.to(this.$el, 0.4, {scale: 3, ease: Expo.easeInOut, clearProps: 'transform'});
};

module.exports = about;