'use strict';

var page = require('page'),
    forEach = require('forEach'),
    bindAll = require('bindall-standalone'),
    // browser = require('common/browser-check'),
    verbose = true;

/**
 * class Router
 * Handle routes. Manage section display
 */
function Router() {
    /*
        DOM Element where append sections
     */
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
    /*
        Reference to all the sections
    */
    this.sections = {};
    /*
        Current section displayed
     */
    this.currentSection = undefined;
    /*
        Default route (can be a 404, or the index)
    */
    this.defaultRoute = '/';

    bindAll(this, 'onDefaultRoute', 'onRoute', 'beforeRouted', 'afterRouted');
}

/*===================================================
    Public API
===================================================*/
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
    if(verbose) console.debug('[Router] add route "' + route.path + '"');
};

/**
 * Add sections to the router
 * @param {object} sections section of the application as 'home': require('sections/home/home')
 */
Router.prototype.setSections = function(sections) {
    this.sections = sections;
    if(verbose) console.debug('[Router] set sections');
};

/**
 * Set DOM Element where append sections
 * @param {DOMElement} el Element where append sections
 */
Router.prototype.setContainer = function(el) {
    this.domContainer = el;
};

/**
 * Start router
 */
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

/**
 * Redirect to the specified route
 * @param  {string} path path where you want to go
 */
Router.prototype.redirect = function (path) {
    page(path);
};

/*===================================================
   Route handlers
===================================================*/
/**
 * Set context and remove previous section
 * @param  {object}   context route context
 * @param  {Function} next    next function to execute
 */
Router.prototype.beforeRouted = function(context, next) {
    this.context.params = context.params;
    this.context.id = this.getCurrentRouteId(context.path);
    this.context.path = context.path;

    if(this.currentSection) {
        this.currentSection.transitionOut(function() {
            this.currentSection.destroy();
            this.currentSection = null;
            next();
        }.bind(this));
    } else {
        next();
    }
};

/**
 * Append new section
 * @param  {object}   context route context
 * @param  {Function} next    function to execute next
 */
Router.prototype.onRoute = function(context, next) {
    if(verbose) console.debug('[Router] onRoute', this.context);

    if(!this.sections[this.context.id].template) {
        console.error('Cannot append null template');
        return;
    }

    this.currentSection = this.sections[this.context.id];
    this.currentSection.append(this.domContainer);
    this.currentSection.routed();

    next();
};

/**
 * Set document metas and call PhantomJS to serve static content if a crawler is parsing the application
 * @param  {object}   context route context
 */
Router.prototype.afterRouted = function(context) {
    //set metas

    if(typeof window.callPhantom === 'function') window.callPhantom();
};

/**
 * Set default route
 * @param {object} defaultRoute default route info
 */
Router.prototype.setDefault = function(defaultRoute) {
    this.defaultRoute = defaultRoute;
    page('*', this.onDefaultRoute);
    this.start();
};

/**
 * When requested route does not exists, redirects to proper default route
 * @param  {object}   context route context
 */
Router.prototype.onDefaultRoute = function(context) {
    history.replaceState({}, '', this.defaultRoute);
    this.redirect(this.defaultRoute);
};

/*===================================================
    Utils
===================================================*/
/**
 * Parse path to get current view to display
 * @param  {string} path current path
 * @return {string}      route id e.g. 'home'
 */
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