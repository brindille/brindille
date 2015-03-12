'use strict';

var domready = require('domready');
var gsap = require('gsap');
var config = require(config);
var router = require('brindille-router');
var Footer = require('layouts/footer/footer');

domready(function() {
  /*
    Layouts
   */
  Footer.appendTo(document.querySelector('footer'));

  /*
    Routing
   */
  router.init({
    el: document.querySelector('#view'),
    debug: config.verbose,
    hashbang: false,
    routes: {
      '/': {
        section: require('sections/home/home'),
        title: 'Brindille - Home',
        description: 'Welcome to Brindille',
        transitionMode: router.TRANSITION_OUT_AND_AFTER_IN
      }
    }
  });
});
