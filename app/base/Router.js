'use strict';

var page = require('page');
var Emitter = require('emitter-component');
var inherits = require('inherits');
var clone = require('clone');
var forEach = require('for-each');
var meta = require('base/utils/meta');
var MobileDetect = require('mobile-detect');
var md = new MobileDetect(window.navigator.userAgent);
var verbose = require('config').verbose;

/**
 * class Router
 * Handle routes. Manage section display
 */
function Router() {
    /*
        DOM Element where append views
     */
    this.$el = document.body;
    /*
        Reference to all the _routes
    */
    this._routes = {};
    /*
        Current section displayed
     */
    this._currentRouteId = undefined;
    /*
        Previous section displayed
     */
    this._previousRouteId = undefined;
    /*
        Default route (can be a 404, or the index)
    */
    this._defaultRoute = '/';
    /*
        Use URL with hashbang
     */
    this._useHashbang = false;
}
// Make Router an event emitter
inherits(Router, Emitter);

/*===================================================
    Public API
===================================================*/
/**
 * Initialize router with routes, element containing views and hashbang usage
 * @param  {object} options
 */
Router.prototype.init = function(options) {
    this.$el = document.querySelector(options.el) || document.body;
    this._routes = options.routes || {};
    this._useHashbang = options.hashbang || false;

    // set routes
    forEach(this._routes, function(value, index) {
        _addRoute.call(this, index);
        if (value.isDefault) {
            this._defaultRoute = index;
        }
    }.bind(this));

    // set default route
    page('*', _onDefaultRoute.bind(this));

    // start router
    this.emit('init');
    page.base(window.location.pathname.substring(0, window.location.pathname - 1));
    _start.call(this);
};

/**
 * Redirect to the specified route
 * @param  {string} path path where you want to go
 */
Router.prototype.redirect = function(path) {
    this.emit('redirect', path);
    page(path);
};

/*===================================================
    Private API
===================================================*/

/**
 * Add route to the router
 * @param {strinh} path  route path
 */
function _addRoute(path) {
    page(path, _beforeRouted.bind(this), _onRouted.bind(this), _afterRouted.bind(this));

    if (verbose) {
        console.debug('[Router] add route "' + path + '"');
    }
}

/**
 * Start router
 */
function _start() {
    if (~~md.version('IE') === 9) {
        // F*cking IE
        history.redirect();
        page.base('/#');
    }
    page.start({
        hashbang: this._useHashbang
    });
}

/*===================================================
   Route handlers
===================================================*/
/**
 * Remove previous section
 * @param  {object}   context route context
 * @param  {Function} next    next function to execute
 */
function _beforeRouted(context, next) {
    if (this._currentRouteId) {
        this.emit('beforeRouted');

        if (this._routes[this._currentRouteId].section.transitionMode === 'manual') {
            this._routes[this._currentRouteId].section.once('onTransitionOutComplete', function() {
                this._routes[this._currentRouteId].section.remove();
                next();
            }.bind(this));
            this._routes[this._currentRouteId].section.playTransitionOut();
        } else {
            this._previousRouteId = this._currentRouteId;
            this._currentRouteId = null;
            next();
        }

    } else {
        next();
    }
}

/**
 * Append new section
 * @param  {object}   context route context
 * @param  {Function} next    function to execute next
 */
function _onRouted(context, next) {
    this._currentRouteId = _findCurrentRouteId.call(this, context.path);
    this._routes[this._currentRouteId].section.model.routeParams = clone(context.params);
    this._routes[this._currentRouteId].section.appendTo(this.$el);
    if (this._routes[this._currentRouteId].section.transitionMode === 'manual') {
        // TODO: remove hidden attribute on current view
        this._routes[this._currentRouteId].section.playTransitionIn();
    } else {
        transition.call(this, this._routes[this._currentRouteId].section.transitionMode);
    }

    if (verbose) {
        console.debug('[Router] on route "' + this._currentRouteId + '"');
    }

    this.emit('onRouted', this._currentRouteId);
    next();
}

/**
 * Set document metas and call PhantomJS to serve static content if a crawler is parsing the application
 * @param  {object}   context route context
 */
function _afterRouted(context) {
    meta.setTitle(this._routes[this._currentRouteId].title);
    meta.setDescription(this._routes[this._currentRouteId].description);

    this.emit('afterRouted');
    if (typeof window.callPhantom === 'function') {
        window.callPhantom();
    }
}

/**
 * When requested route does not exists, redirects to proper default route
 * @param  {object}   context route context
 * @param  {function} next next callback
 */
function _onDefaultRoute(context, next) {
    history.replaceState({}, '', this._defaultRoute);
    this.redirect(this._defaultRoute);
    next();
}

/*===================================================
    Utils
===================================================*/
/**
 * Parse path to get current view to display
 * @param  {string} path current path
 * @return {string}      route id e.g. 'home'
 */
function _findCurrentRouteId(path) {
    var match, id;
    forEach(this._routes, function(value, index) {
        match = path.match(new RegExp((index.replace(/:[a-z1-9]+/g, '[a-z1-9-]+')).replace(/\//g, '\\/'), 'g'));

        if (match && match.length > 0) {
            id = index;
        }
    });

    return id;
}

/*===================================================
    Transitions
===================================================*/
function transition(transitionMode) {
    switch (transitionMode) {
        case 'inAndAfterOut':
            transitionInAndAfterOut.call(this);
            break;
        case 'outAndAfterIn':
            transitionOutAndAfterIn.call(this);
            break;
        case 'inAndOutTogether':
            transitionInAndOutTogether.call(this);
            break;
        case 'transitionInOnly':
            this._routes[this._previousRouteId].section.remove();
            // TODO: remove hidden attribute on current view
            this._routes[this._currentRouteId].section.playTransitionIn();
            break;
        case 'transitionOutOnly':
            this._routes[this._previousRouteId].section.once('onTransitionOutComplete', function() {
                this._routes[this._previousRouteId].section.remove();
                // TODO: remove hidden attribute on current view
            }.bind(this));
            this._routes[this._previousRouteId].section.playTransitionOut();
            break;
        default:
            this._routes[this._previousRouteId].section.remove();
            // TODO: remove hidden attribute on current view
            break;
    }
}

function transitionInAndAfterOut() {
    this._routes[this._currentRouteId].section.once('onTransitionInComplete', function() {
        this._routes[this._previousRouteId].section.once('onTransitionOutComplete', function() {
            this._routes[this._previousRouteId].section.remove();
        }.bind(this));
        this._routes[this._previousRouteId].section.playTransitionOut();
    }.bind(this));
    // TODO: remove hidden attribute on current view
    this._routes[this._currentRouteId].section.playTransitionIn();
}

function transitionOutAndAfterIn() {
    this._routes[this._previousRouteId].section.once('onTransitionOutComplete', function() {
        this._routes[this._previousRouteId].section.remove();
        // TODO: remove hidden attribute on current view
        this._routes[this._currentRouteId].section.playTransitionIn();
    }.bind(this));
    this._routes[this._previousRouteId].section.playTransitionOut();
}

function transitionInAndOutTogether() {
    this._routes[this._previousRouteId].section.once('onTransitionOutComplete', function() {
        this._routes[this._previousRouteId].section.remove();
    }.bind(this));
    this._routes[this._previousRouteId].section.playTransitionOut();
    // TODO: remove hidden attribute on current view
    this._routes[this._currentRouteId].section.playTransitionIn();
}

module.exports = new Router();