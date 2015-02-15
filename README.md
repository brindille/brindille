No framework boilerplate
========================

Boilerplate for single page website without using framework.

TODO
====
- Routing
    - ~~Display correct view in function of route~~
    - ~~Make transition between views~~
    - Take care of route params in view
- Templating (maybe use Handlebar or an other)
    - ~~easily append view template such as `<div data-template="my-template"></div>`~~
    - ~~bind data such as `<h1>{{ title }}</h1>`~~
    - append components
- Component building
    - easily register component in view
    - use component template inside a view
    - data binding
    - events handlers
    - maybe give some parameters by the parent view
- Serve page to crawlers
    - redirect crawlers
    - render requested page using PhantomJS