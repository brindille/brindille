'use strict';

var router = require('./router');

/*
    AppCore
    Manage all the application (views, components, layouts, ...)
 */
function AppCore (options) {
    // Node where append section
    this.el = document.querySelector( options.el ) || document.body;
    // Views of app
    this.views = options.views || {};
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
    router.on('router:update', this.onRoute.bind(this));
    // Append layouts
    this.addLayouts();
    // Add routes to router and start it
    this.addRoutes();
    router.start();
};

/*
    Add routes to router
 */
AppCore.prototype.addRoutes = function() {
    var defaultRoute;
    for(var route in this.routes) {
        if(route[0] !== '/') continue;

        router.addRoute({
            id: route.slice(1),
            path: route
        });
        if(this.routes[route].isDefault) defaultRoute = route;
    }

    if(defaultRoute) router.setDefault(defaultRoute);
};

/*
    Change view when route change
 */
AppCore.prototype.onRoute = function(context) {
    if(!this.views[context.id].template) {
        console.error('Cannot append null template');
        return;
    }

    this.previousView = this.currentView;
    if(this.previousView) {
        this.previousView.destruct();
    }
    this.currentView = this.views[context.id];
    this.currentView.routed(this.el);
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