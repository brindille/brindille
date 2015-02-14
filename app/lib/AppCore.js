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
    this.currentView = this.views[context.id];
    this.addCurrentView();
    if(this.previousView) {
        this.transition();
    } else {
        this.transitionInOnly();
    }
};

/*
    Transition between two views
 */
AppCore.prototype.transition = function() {
    switch( this.currentView.transitionType ) {
        case 'inAndAfterOut':
            this.transitionInAndAfterOut();
            break;
        case 'inAndOutTogether':
            this.transitionInAndOutTogether();
            break;
        case 'transitionInOnly':
            this.transitionInOnly();
            break;
        default:
            this.transitionOutAndAfterIn();
            break;
    }
};

/*
    Next view plays transition in
    then, previous plays transition out
 */
AppCore.prototype.transitionInAndAfterOut = function() {
    this.currentView.emitter.once('view:transitionInComplete', function() {
        this.previousView.emitter.once('view:transitionOutComplete', function() {
            this.removePreviousView();
        }.bind(this));

        this.previousView.playTransitionOut();
    }.bind(this));
    this.currentView.playTransitionIn();
};

/*
    Next view plays transition in
    previous view plays transition out
 */
AppCore.prototype.transitionInAndOutTogether = function() {
    this.previousView.emitter.once('view:transitionOutComplete', function() {
        this.removePreviousView();
    }.bind(this));
    this.previousView.playTransitionOut();
    this.currentView.playTransitionIn();
};

/*
    Destroy previous view
    next view plays transition in
 */
AppCore.prototype.transitionInOnly = function() {
    if(this.previousView) {
        this.removePreviousView();
    }
    this.currentView.playTransitionIn();
};

/*
    Previous view plays transition out
    then, next view play transition in
*/
AppCore.prototype.transitionOutAndAfterIn = function() {
    this.previousView.emitter.once('view:transitionOutComplete', function() {
        this.currentView.emitter.once('view:transitionInComplete', function() {
            this.removePreviousView();
        }.bind(this));
        this.nextEl.removeAttribute('hidden');
        this.el.setAttribute('hidden', '');
        this.currentView.playTransitionIn();
    }.bind(this));
    this.nextEl.setAttribute('hidden', '');
    this.previousView.playTransitionOut();
};

AppCore.prototype.removePreviousView = function() {
    document.body.removeChild( this.el );
    this.previousView.destruct();
    this.el = this.nextEl;
};

AppCore.prototype.addCurrentView = function() {
    if(this.previousView) {
        this.nextEl = this.el.cloneNode(true);
        document.body.insertBefore( this.nextEl, this.el );

        this.currentView.append(this.nextEl);
        this.currentView.routed();
    } else {
        this.currentView.append(this.el);
        this.currentView.routed();
    }
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