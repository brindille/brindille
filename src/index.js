import componentManager from 'lib/core/ComponentManager'
import Component from 'brindille-component'
import mediator from 'lib/mediator'
import { initRouter } from 'lib/Router'
import { View } from 'brindille-router'

import 'gsap'
import 'whatwg-fetch'

import './stylus/main.styl'

// Components
import ButtonTest from 'views/components/button-test/ButtonTest'

// Layouts

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

const router = initRouter(rootComponent)
router.start()
router.on('update', route => mediator.emit('router.update', route))
router.on('loaded', route => mediator.emit('router.loaded', route))
