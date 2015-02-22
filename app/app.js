'use strict';

var AppCore = require('lib/AppCore');
var domready = require('domready');

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
    app.init();
});