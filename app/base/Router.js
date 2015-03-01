var Emitter = require('emitter-component'),
    forEach = require('for-each'),
    page = require('page'),
    bindAll = require('bindall-standalone'),
    verbose = require('config').verbose,
    inherits = require('inherits');

var Router = {

	defaultRoute: '/',

	init: function(options) {
		this.routes = options.routes || {};
		forEach(this.routes, function(value, index) {
			this.addRoute(index, value);
			if(value.isDefault) {
				this.defaultRoute = index;
			}
		}.bind(this));
		page(this.onDefaultRoute);
        page.base(window.location.pathname.substring(0, window.location.pathname - 1));
		page();
	},

	onDefaultRoute: function(context) {
		console.log('onDefaultRoute', context, this.defaultRoute);
		page(this.defaultRoute);
	},

	addRoute: function(path, infos) {
		console.log('Router.addRoute', path, infos);
		page(path, this.onPreRouteChange, this.onRouteChange, this.onPostRouteChange);
	},

	onPreRouteChange: function(context, next) {
		console.log('onPreRouteChange', context);
		next();
	},

	onRouteChange: function(context, next) {
		console.log('onRouteChange', context);
		next();
	},

	onPostRouteChange: function(context, next) {
		console.log('onPostRouteChange', context);
		// next();
	}
};

inherits(Router, Emitter);

bindAll(Router, 'onDefaultRoute', 'addRoute', 'onPreRouteChange', 'onPostRouteChange', 'onRouteChange');

module.exports = Router;