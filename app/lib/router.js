'use strict';

var page = require('page'),
    // extend = require('extend'),
    forEach = require('forEach'),
    // browser = require('common/browser-check'),
    EventEmitter = require('events').EventEmitter,
    verbose = true;

function Router() {
    this.emitter = new EventEmitter();
    /*
        This object is dispatched on each locationChange.
        It holds the current path, the route params...
     */
    this.context = {
        path: '',
        id: undefined,
        params: undefined
    };
    /*
        Reference to all the routes
    */
    this.routeIds = [];
    /*
        Default route (can be a 404, or the index)
    */
    this.defaultRoute = '/';
}
/**
 * Add route to the router
 * @param {object} route route infos as {id: "route-id", path: "/route"} or {id: "route-id", path: "/route/:id"}
 */
Router.prototype.addRoute = function(route) {
    this.routeIds.push({id: route.id, path: route.path});
    page(route.path, this.onRoute.bind(this));
    if(verbose) console.debug('[router] add route "' + route.path + '"');
};

Router.prototype.setDefault = function(defaultRoute) {
    this.defaultRoute = defaultRoute;
    page('*', this.onDefaultRoute.bind(this));
    this.start();
};

Router.prototype.start = function() {
    // if(browser.isIE9) {
    //     // F*cking IE
    //     history.redirect();
    //     page.base('/#');
    // }
    page.start({
        hashbang: false
    });
    this.emitter.emit('router:start');
};

Router.prototype.onRoute = function(context, next) {
    this.context.params = context.params;
    this.context.id = this.getCurrentRouteId(context.path);
    this.context.path = context.path;

    if(verbose) console.debug('[router] onRoute', this.context);
    this.emitter.emit('router:update', this.context);
};

// When requested route does not exists, redirects to proper default route
Router.prototype.onDefaultRoute = function(c) {
    history.replaceState({}, '', this.defaultRoute);
    this.redirect(this.defaultRoute);
};

Router.prototype.redirect = function (path) {
    page(path);
};

Router.prototype.getCurrentRouteId = function(path) {
    var match, id;
    forEach(this.routeIds, function(value, index){
        match = path.match(new RegExp((value.path.replace(/:[a-z1-9]+/g, '[a-z1-9-]+')).replace(/\//g, '\\/'), 'g'));
        if(match && match.length > 0) {
            id = value.id;
        }
    });
    return id;
};

module.exports = new Router();