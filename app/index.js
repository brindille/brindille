'use strict';

var AppCore = require('lib/AppCore');
var domready = require('domready');
var gsap = require('gsap');
var scroll = require('utils/scroll');
var View = require('base/View2');
var Router = require('base/Router');
var Q = require('q');

domready(function() {

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
            time: 0,
            list: ['banana', 'apple', 'orange']
        },
        compose: {
            'test': require('components/component-test-g/componentTestG')
        }
    });
    view.appendTo(document.body);

    setTimeout(function() {
        view.model.title = 'zob';
        view.model.sub.trou = 'foot';
        view.model.firstTitle = 'ojsf';
    }, 2000);
});