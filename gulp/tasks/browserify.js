// Uncomment to debug browserify + shim
// process.env.BROWSERIFYSHIM_DIAGNOSTICS = 1;

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    notify = require("gulp-notify"),
    argv = require('yargs').argv,
    browserify = require('browserify'),
    watchify = require('watchify'),
    gStreamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    bundleLogger = require('../utils/bundleLogger'),
    handleErrors = require('../utils/handleErrors'),
    options = require('../options');

var env = argv.env != "production";

gulp.task('browserify', function()
{
    aliasify = require('aliasify').configure({
        aliases: {
            'components': '../../app/components',
            'sections': '../../app/sections',
            'layouts': '../../app/layouts',
            'lib': '../../app/lib',
        },
        configDir: __dirname,
        verbose: false
    });

    var b = browserify(process.cwd() + '/app/app.js', {
        cache: {},
        packageCache: {},
        debug: env,
        fullPaths: true
    });
    var file = 'build.js';
    var folder = process.cwd() +'/static/build/';

    b.transform(aliasify);

    var bundler = options.isWatching ? watchify(b) : b;

    var bundle = function() {
        bundleLogger.start();

        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source(file))
            .pipe(argv.env != "production" ? gutil.noop() : gStreamify(uglify()))
            .pipe(gulp.dest(folder))
            .on('end', bundleLogger.end);
    };

    if(options.isWatching) bundler.on('update', bundle);

    return bundle();
});