# brindille

Javascript front-end project boilerplate.

It uses:

- [docker](http://docker.com/) with nginx and php
- [silex](http://silex.sensiolabs.org/)
- [twig](http://twig.sensiolabs.org/)
- [stylus](http://learnboost.github.io/stylus/)
- [babel](https://babeljs.io/)
- [browserify](http://browserify.org/)

## Install

You need to have `docker` and `docker-compose` installed.
Clone this repository and install the dependencies

```bash
git clone https://github.com/brindille/brindille.git ./my-project
cd my-project
rm -rf ./.git
npm install && composer install
```

## Run

Launch docker config.

```bash
docker-compose up -d
```

Launch local bundling.

```bash
npm start
```

When you are done don't forget to stop docker

```bash
docker-compose stop
```

## File structure

Organise your files in a component structure: JavaScript, template and styles of a component should be in the same folder. (ex: `/src/views/components/button-test`.)
Then, they will be build in the `/public/build` folder.

Images, fonts and other assets have to be in the `/public/assets/{images,fonts}` folders.

## Templating

Templating uses [twig engine](http://twig.sensiolabs.org/). We added a useful `brindillePage` function you can use in your template to create a link for a given page.

## Localization

Brindille is multilingual by default, you can set up languages in `data/languages.yaml`.

## Ressources

- [Component documentation](https://github.com/brindille/brindille-component/blob/master/README.md)
- [Other brindille modules](https://github.com/brindille)

## Tasks

### Dev

Builds CSS & JS files and watches for changes.

```bash
npm start
```

### Production

Build the files and minify them.

```bash
npm run build
```

## License

MIT
