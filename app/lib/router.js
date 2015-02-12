'use strict';

var page = require('page'),
    extend = require('extend'),
    forEach = require('forEach'),
    // browser = require('common/browser-check'),
    EventEmitter = require('events').EventEmitter,
    verbose = true;

module.exports = extend({
    /*
        This object is dispatched on each locationChange.
        It holds the current path, the route params...
     */
    context: {
        path: '',
        id: undefined,
        params: undefined
    },
    /*
        Reference to all the routes
    */
    routeIds: [],
    /*
        Default route (can be a 404, or the index)
    */
    defaultRoute: '/',

    /**
     * Add route to the router
     * @param {object} route route infos as {id: "route-id", path: "/route"} or {id: "route-id", path: "/route/:id"}
     */
    addRoute: function(route) {
        this.routeIds.push({id: route.id, path: route.path});
        page(route.path, this.onRoute.bind(this));
        if(verbose) console.debug('[router] add route "' + route.path + '"');
    },

    setDefault: function(defaultRoute) {
        this.defaultRoute = defaultRoute;
        page('*', this.onDefaultRoute.bind(this));
        this.start();
    },

    start: function() {
        // if(browser.isIE9) {
        //     // F*cking IE
        //     history.redirect();
        //     page.base('/#');
        // }
        page.start({
            hashbang: false
        });
        this.emit('router:start');
    },

    onRoute: function(context, next) {
        this.context.params = context.params;
        this.context.id = this.getCurrentRouteId(context.path);
        this.context.path = context.path;

        if(verbose) console.debug('[router] onRoute', this.context);
        this.emit('router:update', this.context);
    },

    // When requested route does not exists, redirects to proper default route
    onDefaultRoute: function(c) {
        history.replaceState({}, '', this.defaultRoute);
        this.redirect(this.defaultRoute);
    },

    redirect: function (path) {
        page(path);
    },

    getCurrentRouteId: function(path) {
        var match, id;
        forEach(this.routeIds, function(value, index){
            match = path.match(new RegExp((value.path.replace(/:[a-z1-9]+/g, '[a-z1-9-]+')).replace(/\//g, '\\/'), 'g'));
            if(match && match.length > 0) {
                id = value.id;
            }
        });
        return id;
    },
}, new EventEmitter());
