# brindille

Javascript front-end project boilerplate.

It uses:
- [gulp](http://gulpjs.com/)
- [browserify](http://browserify.org/)
- [rivets](http://rivetsjs.com/)
- [stylus](http://learnboost.github.io/stylus/)

## Install

Clone this repository and install the dependencies

```bash
rm -rf ./.git
npm install
```

## File structure

Organise your files in a component structure: JavaScript, template and styles of a component should be in the same folder. (ex: `/app/components/component-test`.)
Then, they will be build in the `/static/build` folder.

Images, fonts and other assets have to be in the `/static/{images,fonts}` folders.

## Ressources

- [View documentation](https://github.com/brindille/brindille-view/blob/master/README.md)
- [Router documentation](https://github.com/brindille/brindille-router/blob/master/README.md)

## Tasks

### Dev

Builds CSS & JS files and watches for changes.

```bash
npm run dev
```

### Server

Executes dev task and run a local server.

```bash
npm start
```

### Production

Build the files and minify them.

```bash
npm run prod
```

## License

MIT