'use strict';

var Router = require('./Router');

/**
 * class AppCore
 * Manage all the application (sections, components, layouts, ...)
 * @param {object} options references to each part of the applications
 */
function AppCore (options) {
    /*
        Node where append section
     */
    this.el = document.querySelector( options.el ) || document.body;
    /*
        App sections
     */
    this.sections = options.sections || {};
    /*
        App routes
     */
    this.routes = options.routes || {};
    /*
        App layouts
     */
    this.layouts = options.layouts || {};
    /*
        App components
     */
    this.components = options.components || {};
}

/**
 * Initialization
 */
AppCore.prototype.init = function() {
    // Append layouts
    this.addLayouts();
    // Add routes to router and start it
    Router.setContainer(this.el);
    Router.setSections(this.sections);
    this.addRoutes();
    Router.start();
};

/**
 * Add routes to Router
 */
AppCore.prototype.addRoutes = function() {
    var defaultRoute;
    for(var route in this.routes) {
        if(route[0] !== '/') continue;

        Router.addRoute({
            id: route.slice(1),
            path: route
        });
        if(this.routes[route].isDefault) defaultRoute = route;
    }

    if(defaultRoute) Router.setDefault(defaultRoute);
};

/**
 * Append layouts
 */
AppCore.prototype.addLayouts = function() {
    for(var layout in this.layouts) {
        this.layouts[layout].append();
    }
};

module.exports = AppCore;