'use strict';

var AppCore = require('lib/AppCore');
var domready = require('domready');
var gsap = require('gsap');
var scroll = require('brindille-scroll');
var View = require('base/View');
var Router = require('base/Router');
var config = require(config);
var Q = require('q');
var preloader = require('brindille-preloader');

domready(function() {
    var promiseTest = function(ms, res) {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(res);
        }, ms);
        return deferred.promise;
    };

    var view = new View({
        template: require('components/dom-component/domComponent.dom'),
        model: {
            title: 'bonjour',
            sub: {
                trou: 'couche'
            },
            subtitle: 'monde',
            firstTitle: 'coucou',
            secondTitle: 'hello2',
            trou: 'wesh',
            test: {
                deep: {
                    stuff: {
                        trou: 'O'
                    }
                }
            },
            time: 0,
            list: ['banana', 'apple', 'orange']
        },
        resolve: {
            p1: promiseTest(1000, 'coucou'),
            p2: promiseTest(4000, 'coucou2'),
            assets: preloader.load([
                {
                    id: 'imgTest1',
                    src: config.assetsRoot + 'images/61.jpg'
                },
                {
                    id: 'imgTest2',
                    src: config.assetsRoot + 'images/62.jpg'
                }
            ]).getPromise()
        },
        compose: {
            'test': require('components/component-test-g/componentTestG')
        }
    });
    view.transitionIn = function(onCompleteCallback) {
        var tl = new TimelineMax({
            onComplete: onCompleteCallback
        });
        tl.fromTo(this.$el, 0.4, {
            alpha: 0,
            y: 150
        }, {
            alpha: 1,
            y: 0,
            ease: Expo.easeInOut
        });
    };
    view.transitionOut = function(onCompleteCallback) {
        var tl = new TimelineMax({
            onComplete: onCompleteCallback
        });
        tl.to(this.$el, 0.4, {
            scale: 3,
            ease: Expo.easeInOut,
            clearProps: 'transform'
        });
    };

    Router.init({
        el: '#view',
        hashbang: false,
        routes: {
            '/home': {
                section: view,
                isDefault: true,
                title: 'Brindille - Home',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
            },
            '/about': {
                section: require('sections/about/about'),
                isDefault: false,
                title: 'Brindille - About',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
            }
        }
    });

    var interval = setInterval(function() {
        view.model.time += 1;
    }, 10);

    setTimeout(function() {
        view.model.title = 'zob';
        view.model.sub.trou = 'foot';
        view.model.firstTitle = 'ojsf';
        view.model.secondTitle = '#######';
        clearInterval(interval);
    }, 1000);

});
