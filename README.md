# brindille

Javascript front-end project boilerplate.

It uses:
- [twig](http://twig.sensiolabs.org/)
- [stylus](http://learnboost.github.io/stylus/)
- [babel](https://babeljs.io/)
- [browserify](http://browserify.org/)

## Install

Clone this repository and install the dependencies

```bash
git clone https://github.com/brindille/brindille.git ./my-project
cd my-project
rm -rf ./.git
npm install && composer install
```

## File structure

Organise your files in a component structure: JavaScript, template and styles of a component should be in the same folder. (ex: `/src/views/components/button-test`.)
Then, they will be build in the `/public/build` folder.

Images, fonts and other assets have to be in the `/public/assets/{images,fonts}` folders.

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
