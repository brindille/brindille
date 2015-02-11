var gulp = require('gulp');

gulp.task('watch', ['browserify'], function() {
    gulp.watch([process.cwd() +'/app/**/*.scss', process.cwd() +'/sass/**/*.scss'], ['styles']);
});