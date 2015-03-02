var Emitter = require('emitter-component'),
    forEach = require('for-each'),
    page = require('page'),
    bindAll = require('bindall-standalone'),
    verbose = require('config').verbose,
    MobileDetect = require('mobile-detect'),
    md = new MobileDetect(window.navigator.userAgent),
    inherits = require('inherits');

var Router = {

	defaultRoute: '/',

	init: function(options) {
		
		this.routes = options.routes || {};
		this.$el = options.el ? document.querySelector(options.el) : document.body;

		forEach(this.routes, function(value, index) {
			this.addRoute(index, value);
			if(value.isDefault) {
				this.defaultRoute = index;
			}
		}.bind(this));
		page(this.onDefaultRoute);
        page.base(window.location.pathname.substring(0, window.location.pathname - 1));
		this.start();
	},

	start: function() {
		if(~~md.version('IE') === 9) {
	        // F*cking IE
	        history.redirect();
	        page.base('/#');
	    }
	    page.start({
	        hashbang: false
	    });
	},

	redirect: function(path) {
		page(path);
	},

	onDefaultRoute: function(context, next) {
		console.log('onDefaultRoute', context, this.defaultRoute);
		history.replaceState({}, '', this.defaultRoute);
		this.redirect(this.defaultRoute);
		next();
	},

	addRoute: function(path, infos) {
		console.log('Router.addRoute ------', path, infos);
		page(path, this.onPreRouteChange, this.onRouteChange, this.onPostRouteChange);
	},

	onPreRouteChange: function(context, next) {
		// console.log('onPreRouteChange', context);
		next();
	},

	onRouteChange: function(context, next) {
		console.log('onRouteChange', context, this.$el.children.length);
		var newView, oldView;
		if(this.$el.children.length === 0) {
			// newView = new 
		}
		else {

		}
		next();
	},

	onPostRouteChange: function(context, next) {
		// console.log('onPostRouteChange', context);
		// next();
	}
};

inherits(Router, Emitter);

bindAll(Router, 'onDefaultRoute', 'addRoute', 'onPreRouteChange', 'onPostRouteChange', 'onRouteChange');

module.exports = Router;