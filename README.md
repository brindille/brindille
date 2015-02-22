No framework boilerplate
========================

Boilerplate for single page website without using framework.

TODO
====
- [x] Routing
    - [x] Display correct view in function of route
    - [x] Make transition between views
    - [x] Take care of route params in view
- [ ] Templating (maybe use Handlebar or an other)
    - [x] easily append view template such as `<div data-template="my-template"></div>`
    - [x] bind data such as `<h1>{{ title }}</h1>`
    - [ ] recompile template when data change
    - [ ] append components
- [ ] Component building
    - [ ] easily register component in view
    - [ ] use component template inside a view
    - [ ] data binding
    - [ ] events handlers
    - [ ] maybe give some parameters by the parent view
- [x] Serve page to crawlers
    - [x] redirect crawlers
    - [x] render requested page using PhantomJS