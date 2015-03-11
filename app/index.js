'use strict';

var domready = require('domready');
var gsap = require('gsap');
var config = require(config);
var router = require('brindille-router');

domready(function() {
  router.init({
    el: document.querySelector('#view'),
    debug: config.verbose,
    hashbang: false,
    routes: {
      '/': {
        section: require('sections/home/home'),
        title: 'Brindille - Home',
        description: 'Welcome to Brindille',
        transitionMode: router.TRANSITION_OUT_AFTER_IN
      }
    }
  });
});
