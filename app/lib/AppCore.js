'use strict';

var Router = require('./Router');
var verbose = require('app/config').verbose;

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
    // Set references to main app
    for(var i in this.layouts) {
        this.layouts[i].app = this;
    }
    for(var j in this.sections) {
        this.sections[j].app = this;
    }
    // Append layouts
    this.addLayouts();
    // Add routes to router and start it
    Router.setSections(this.sections);
    this.addRoutes();
    Router.start();
    if(verbose) console.debug('[AppCore] init');
};

/**
 * Add routes to Router
 */
AppCore.prototype.addRoutes = function() {
    var defaultRoute;
    for(var route in this.routes) {
        if(route[0] !== '/') continue;

        Router.addRoute({
            id: this.routes[route].section,
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

AppCore.prototype.getComponent = function (id) {
    console.log(this);
    return this.components[id];
};

module.exports = AppCore;