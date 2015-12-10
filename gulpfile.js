'use strict';

let gulp = require('gulp');
let jasmine = require('gulp-jasmine');

gulp.task('test', () => {
  return gulp.src('spec/*.js')
  .pipe(jasmine());
});

gulp.task('test-dev', () => {
  gulp.watch(['src/**', 'spec/**'], ['test']);
});
