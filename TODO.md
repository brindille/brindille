TODO
====
- [ ] Routing
    - [x] Display correct view in function of route
    - [ ] Make transition between views
    - [x] Take care of route params in view
    - [x] Set document metas
- [ ] Templating (maybe use Handlebar or an other)
    - [x] easily append view template such as `<div data-template="my-template"></div>`
    - [x] bind data such as `<h1>{{ title }}</h1>`
    - [x] recompile template when data change
    - [ ] hide views on append, show them on transitionIn
    - [x] make correct DOM tree
    - [x] append components
    - [x] create pool object to prevent `this.components.foo.data.bar = something`
- [ ] Component building
    - [x] easily register component in view
    - [x] use component template inside a view
    - [x] data binding
    - [x] recompile template when data change
    - [x] events handlers
    - [x] maybe give some parameters by the parent view
- [x] Serve page to crawlers
    - [x] redirect crawlers
    - [x] render requested page using PhantomJS
- [ ] Global
    - [ ] remove unused components from package.json

- [ ] View 2.0 (GG)
    - [x] Add resolve param and methods to handle promise resolving before transitioning (if it exists)