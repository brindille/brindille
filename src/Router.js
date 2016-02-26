import page from 'page';
import request from 'request';
import bindAll from 'lodash.bindall';
import Mediator from 'lib/Mediator.js';
import state from 'lib/state';

class Router {
  constructor() {
    this.currentPath = undefined;
    this.previousPath = '';
    this.previousPageId = '';
    this.currentPageId = '';
    this.currentLang = '';
    this.isFirstRoute = true;
    this.isReady = true;
    this.routes = [];
    this.defaultRoute = '';

    bindAll(this, 'loadRoute', 'routeLoaded', 'routeCompleted', 'notFoundController', 'redirect');

    Mediator.on('router:redirect', this.redirect);
  }

  registerRoutes(routes, defaultRoute) {
    this.routes = [].concat(Object.keys(routes));
    this.defaultRoute = defaultRoute || this.routes[0];

    this.routes.forEach((value) => {
      page('/' + value, this.loadRoute);
    });
    page('*', this.notFoundController);

    if (window.baseUrl) {
      page.base(window.baseUrl);
    }
    page.start();
  }

  /* ========================================================
    Utils
  ======================================================== */
  getPageId(path) {
    let id = path === undefined ? '' : path.split('/')[1];
    return id;
  }

  getPath(context) {
    let id = context.path.replace('/', '');
    let path = id === '' ? this.defaultRoute : id;
    return path;
  }

  /* ========================================================
    Not found / Default route
  ======================================================== */
  notFoundController(context) {
    if (this.routes.indexOf(this.getPageId(this.getPath(context))) < 0) {
        page('/' + this.defaultRoute);
    }
  }

  /* ========================================================
    Route Methods
  ======================================================== */

  redirect(url) {
    page(url);
  }

  loadRoute(context) {
    this.isReady = false;

    let currentPath = this.getPath(context);
    if (currentPath === this.currentPath) return;

    this.previousPath = this.currentPath;
    this.currentPath = currentPath;

    this.previousPageId = this.getPageId(this.previousPath);
    this.currentPageId = this.getPageId(this.currentPath);

    state.currentRoute = this.currentPageId;
    state.previousRoute = this.previousPageId;

    Mediator.emit('route:change:start', this.currentPath, this.isFirstRoute);
    Mediator.off('route:change:done');

    if (this.isFirstRoute) {
      Mediator.once('route:change:done', () => {
        this.routeLoaded(context);
      });
      Mediator.emit('route:change:first', this.currentPath, this.currentPageId);
      return;
    }

    request.get(window.rootUrl + '?c=1&p=' + this.currentPath, (err, res) => {
      if (err) throw new Error(err);
      this.content = JSON.parse(res.body);
      this.routeLoaded(context);
    });
  }

  routeLoaded() {
    if (this.isFirstRoute) {
      this.isFirstRoute = false;
      return this.routeCompleted();
    }
    Mediator.once('route:change:done', this.routeCompleted);
    Mediator.emit('route:change:ready', this.currentPath, this.currentPageId, this.content, this.isFirstRoute);
    Mediator.emit('route', this.currentPageId, this.isFirstRoute);
  }

  routeCompleted() {
    this.isReady = true;
  }
}

export default new Router();
