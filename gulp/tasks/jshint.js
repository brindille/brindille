var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint');

gulp.task('jshint', function() {
    return gulp.src(process.cwd() + '/src/**/*.js')
    .pipe(plumber())
    .pipe(jshint(process.cwd() + '/.jshintrc', {fail: true}))
    .pipe(jshint.reporter('jshint-stylish'));
});
