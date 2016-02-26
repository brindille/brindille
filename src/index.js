import componentManager from 'lib/core/ComponentManager';
import Component from 'lib/core/Component';
import Router from './Router';
import 'gsap';

// datas
import globals from 'data/global.yaml';

// Components
import ButtonTest from 'views/components/button-test/ButtonTest';

// Layouts
import View from 'views/layouts/view/View';

// Sections
import Home from 'views/sections/home/Home';
import About from 'views/sections/about/About';

componentManager.registerMultiple({
  /* Layouts */
  View,
  /* Components */
  ButtonTest,
  /* Sections */
  Home,
  About
});

let rootComponent = new Component(document.body);
componentManager.setRootComponent(rootComponent);

Router.registerRoutes(globals.routes, globals.defaultRoute);
