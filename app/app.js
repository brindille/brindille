var AppCore = require('lib/AppCore');
var domready = require('domready');

var app = new AppCore({
    el: '#view',
    views: {
        'home': require('sections/home/home'),
        'about': require('sections/about/about')
    },
    routes: {
        '/home': {
            view: 'home',
            isDefault: true
        },
        '/about': {
            view: 'about',
            isDefault: false
        }
    },
    layouts: {
        'header': require('layouts/header/header'),
        'footer': require('layouts/footer/footer')
    },
    components: {}
});

domready(function() {
    app.init();
});