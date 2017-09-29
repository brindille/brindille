import page from 'page'
import Mediator from 'lib/Mediator'
import state from 'lib/state'
import classes from 'dom-classes'
import Tracker from 'lib/Tracker'

class Router {
  constructor () {
    this.currentPath = undefined
    this.previousPath = ''
    this.previousPageId = ''
    this.currentPageId = ''
    this.currentLang = ''
    this.isFirstRoute = true
    this.isReady = true
    this.routes = []
    this.defaultRoute = ''

    this.loadRoute = this.loadRoute.bind(this)
    this.routeLoaded = this.routeLoaded.bind(this)
    this.routeCompleted = this.routeCompleted.bind(this)
    this.notFoundController = this.notFoundController.bind(this)
    this.redirect = this.redirect.bind(this)
    this.fullRedirection = this.fullRedirection.bind(this)

    Mediator.on('router:redirect', this.redirect)
    Mediator.on('router:fullredirect', this.redirect)
  }

  registerRoutes (routes, defaultRoute) {
    this.routes = Object.keys(routes)
    this.paths = this.routes.map((key) => routes[key])
    this.defaultRoute = defaultRoute || this.routes[0]
    this.paths.forEach((value) => {
      value = value.replace(/{([a-z]+)}/g, ':$1')
      page(window.isMultilingual ? '/:lang/' + value : '/' + value, this.loadRoute)
    })
    page('*', this.notFoundController)

    if (window.baseUrl) {
      page.base(window.baseUrl)
    }
    page.start()
  }

  /* ========================================================
    Utils
  ======================================================== */
  getPageId (path) {
    let id
    if (path === undefined) {
      id = ''
    } else {
      const pathSplit = path.split('/')
      id = window.isMultilingual ? pathSplit[1] : pathSplit[0]
    }
    return this.routes[this.paths.indexOf(id)]
  }

  getPath (context) {
    let id = context.path.replace('/', '')
    let path = id === '' ? this.defaultRoute : id
    return path
  }

  /* ========================================================
    Not found / Default route
  ======================================================== */
  notFoundController (context) {
    if (this.routes.indexOf(this.getPageId(this.getPath(context))) < 0) {
      let path = '/' + this.defaultRoute
      if (window.isMultilingual) {
        path = '/' + window.lang + path
      }
      page(path)
    }
  }

  showMetanav (isVisible) {
    const root = document.documentElement
    if (isVisible) classes.remove(root, 'no-metanav')
    else classes.add(root, 'no-metanav')
  }

  /* ========================================================
    Route Methods
  ======================================================== */

  redirect (url) {
    let path = url
    if (window.isMultilingual) path = '/' + window.lang + path
    page(path)
  }

  fullRedirection (url) {
    let path = '/' + url
    if (window.isMultilingual) path = '/' + window.lang + path
    window.location.href = 'http://' + window.location.hostname + window.baseUrl + path
  }

  loadRoute (context) {
    this.isReady = false

    let currentPath = this.getPath(context)
    if (currentPath === this.currentPath) return

    this.previousPath = this.currentPath
    this.currentPath = currentPath

    this.previousPageId = this.getPageId(this.previousPath)
    this.currentPageId = this.getPageId(this.currentPath)

    state.currentRoute = this.currentPageId
    state.previousRoute = this.previousPageId

    Mediator.emit('route:change:start', this.currentPath, this.isFirstRoute)
    Mediator.off('route:change:done')

    if (this.isFirstRoute) {
      Mediator.once('route:change:done', () => {
        this.routeLoaded(context)
      })
      Mediator.emit('route:change:first', this.currentPath, this.currentPageId)
      return
    }

    console.log('loadRoute', window.baseUrl, '|||', context.path)

    window.fetch(window.baseUrl + context.path + '?t=content', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {
      return response.json()
    }).then((json) => {
      this.content = json
      this.routeLoaded(context)
    })
  }

  routeLoaded (context) {
    if (this.isFirstRoute) {
      this.isFirstRoute = false
      if (this.currentPageId === 'home') {
        setTimeout(() => { Tracker.trackPage('intro', context.params) }, 500)
      }
      return this.routeCompleted()
    }
    Tracker.trackPage(this.currentPageId, context.params)
    Mediator.once('route:change:done', this.routeCompleted)
    Mediator.emit('route:change:ready', this.currentPath, this.currentPageId, this.content, this.isFirstRoute)
    Mediator.emit('route', this.currentPageId, this.isFirstRoute)
  }

  routeCompleted () {
    this.isReady = true
  }
}

export default new Router()
