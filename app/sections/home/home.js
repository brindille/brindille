'use strict';

var factory = require('lib/factory');

var Home = factory.view({
  template: require('./home.html'),
  model: {
    name: 'John',
    link: 'http://github.com'
  },
  compose: {
    'component-test': require('components/component-test/componentTest')
  },
  resolve: {}
});

Home.prototype.transitionIn = function() {
  TweenMax.from(this.$el, 1, {
    alpha: 0,
    onComplete: this.onTransitionInComplete
  });
};

Home.prototype.transitionOut = function() {
  TweenMax.to(this.$el, 1, {
    alpha: 0,
    onComplete: this.onTransitionOutComplete
  });
};

module.exports = Home;
