'use strict';

var Router = require('./Router');

/*
    AppCore
    Manage all the application (sections, components, layouts, ...)
 */
function AppCore (options) {
    // Node where append section
    this.el = document.querySelector( options.el ) || document.body;
    // Sections of app
    this.sections = options.sections || {};
    // Routes of app
    this.routes = options.routes || {};
    // Layout of app
    this.layouts = options.layouts || {};
    // Components of app
    this.components = options.components || {};
}

/*
    Initialization
 */
AppCore.prototype.init = function() {
    // Router.emitter.on('router:update', this.onRoute.bind(this));
    // Append layouts
    this.addLayouts();
    // Add routes to router and start it
    Router.setContainer(this.el);
    Router.setSections(this.sections);
    this.addRoutes();
    Router.start();
};

/*
    Add routes to Router
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

/*
    Append view layouts
 */
AppCore.prototype.addLayouts = function() {
    for(var layout in this.layouts) {
        this.layouts[layout].append();
    }
};

module.exports = AppCore;