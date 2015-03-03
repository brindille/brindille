'use strict';

var AppCore = require('lib/AppCore');
var domready = require('domready');
var gsap = require('gsap');
var scroll = require('utils/scroll');
var View = require('base/View');
var Router = require('base/Router');

var app = new AppCore({
    el: '#view',
    sections: {
        'home': require('sections/home/home'),
        'about': require('sections/about/about')
    },
    routes: {
        '/home': {
            section: 'home',
            isDefault: true
        },
        '/about': {
            section: 'about',
            isDefault: false
        }
    },
    layouts: {
        'header': require('layouts/header/header'),
        'footer': require('layouts/footer/footer')
    },
    components: {
        'component-test': require('components/component-test/componentTest')
    }
});

domready(function() {
    // app.init();

    // var Component = require('components/component-test-g/componentTestG');
    // var component = new Component();
    // console.log(component);

    Router.init({
        routes: {
            '/home': {
                section: require('sections/home-g/homeG'),
                isDefault: true
            }
        }
    });

    var view = new View({
        template: '<div style="border: 1px solid white; padding: 10px;margin: 10px;"><h1>I\'m a view with child components</h1><br/><h2>Rapidly changing value: {{=data.time}}</h2><br/><div><a href="/home">home</a> - <a href="/about">about</a></div><ul>{{~data.list :value:index }}<li>{{=index}} - {{=value}}</li>{{~}}</ul></div>',
        data: {
            title: 'bonjour',
            subtitle: 'monde',
            firstTitle: 'coucou',
            secondTitle: 'hello',
            time: 0,
            list: ['banana', 'apple', 'orange']
        },
        components: {
            "test": require('components/component-test-g/componentTestG')
        }
    });
    view.appendTo(document.body);

    setTimeout(function() {
        view.data.time = 1;
    }, 10);

});