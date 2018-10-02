import { createRouter } from 'brindille-router'
import routesDatas from 'json-loader!yaml-loader!data/routes.yaml'

export let router = null

export function initRouter(rootComponent) {
  const routes = window.isMultilingual
    ? routesDatas.map(route =>
        Object.assign(route, { path: '/:lang/' + route.path })
      )
    : routesDatas
  router = createRouter(rootComponent, {
    routes,
    verbose: false,
    getContent: (route, path, baseUrl) => {
      return window
        .fetch(baseUrl + path + '?t=content', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .then(response => response.json())
        .then(json => json.html)
    }
  })
  return router
}

export function getCurrentRoute() {
  if (router) {
    return router.currentRoute
  } else {
    throw new Error('WAIT router is not ready yet !')
  }
}
