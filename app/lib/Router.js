'use strict';

var page = require('page'),
    forEach = require('forEach'),
    bindAll = require('bindall-standalone'),
    // browser = require('common/browser-check'),
    EventEmitter = require('events').EventEmitter,
    verbose = true;

function Router() {
    this.emitter = new EventEmitter();

    this.domContainer = document.body;
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
    this.routes = [];

    this.sections = {};

    this.currentView = undefined;
    /*
        Default route (can be a 404, or the index)
    */
    this.defaultRoute = '/';

    bindAll(this, 'onDefaultRoute', 'onRoute', 'beforeRouted', 'afterRouted');
}
/**
 * Add route to the router
 * @param {object} route route infos as {id: "route-id", path: "/route"} or {id: "route-id", path: "/route/:id"}
 */
Router.prototype.addRoute = function(route) {
    this.routes.push({
        id: route.id,
        path: route.path
    });
    page(route.path, this.beforeRouted, this.onRoute, this.afterRouted);
    if(verbose) console.debug('[router] add route "' + route.path + '"');
};

Router.prototype.setSections = function(sections) {
    this.sections = sections;
    if(verbose) console.debug('[router] set sections');
};

Router.prototype.setContainer = function(el) {
    this.domContainer = el;
};

Router.prototype.setDefault = function(defaultRoute) {
    this.defaultRoute = defaultRoute;
    page('*', this.onDefaultRoute);
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
};

/************************
 *  Route handlers
 ************************/
Router.prototype.beforeRouted = function(context, next) {
    this.context.params = context.params;
    this.context.id = this.getCurrentRouteId(context.path);
    this.context.path = context.path;

    if(this.currentView) {
        this.currentView.transitionOut(function() {
            this.currentView.destroy();
            this.currentView = null;
            next();
        }.bind(this));
    } else {
        next();
    }
};

Router.prototype.onRoute = function(context, next) {
    if(verbose) console.debug('[router] onRoute', this.context);

    if(!this.sections[this.context.id].template) {
        console.error('Cannot append null template');
        return;
    }

    this.currentView = this.sections[this.context.id];
    this.currentView.append(this.domContainer);
    this.currentView.routed();

    next();
};

Router.prototype.afterRouted = function(context, next) {
    //set metas

    if(typeof window.callPhantom === 'function') window.callPhantom();
};

/*
    When requested route does not exists, redirects to proper default route
 */
Router.prototype.onDefaultRoute = function(c) {
    history.replaceState({}, '', this.defaultRoute);
    this.redirect(this.defaultRoute);
};

Router.prototype.redirect = function (path) {
    page(path);
};

/************************
 *  Utils
 ************************/
Router.prototype.getCurrentRouteId = function(path) {
    var match, id;
    forEach(this.routes, function(value, index){
        match = path.match(new RegExp((value.path.replace(/:[a-z1-9]+/g, '[a-z1-9-]+')).replace(/\//g, '\\/'), 'g'));
        if(match && match.length > 0) {
            id = value.id;
        }
    });
    return id;
};



module.exports = new Router();