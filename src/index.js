import componentManager from 'lib/core/ComponentManager'
import Component from 'brindille-component'
import Router from './Router'
import 'gsap'
import 'whatwg-fetch'

// datas
import routes from 'json-loader!yaml-loader!data/routes.yaml'

// Components
import ButtonTest from 'views/components/button-test/ButtonTest'

// Layouts
import View from 'views/layouts/view/View'

// Sections
import Home from 'views/sections/home/Home'
import About from 'views/sections/about/About'

componentManager.registerMultiple({
  /* Layouts */
  View,
  /* Components */
  ButtonTest,
  /* Sections */
  Home,
  About
})

let rootComponent = new Component(document.body, componentManager.get)
componentManager.setRootComponent(rootComponent)

Router.registerRoutes(routes, routes[0])

console.log('COUCOU')
