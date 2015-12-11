'use strict';

let gulp = require('gulp');
let filter = require('gulp-filter');
let babel = require("gulp-babel");
let jasmine = require('gulp-jasmine');

const buildPath = 'build';
const distPath = 'dist';

gulp.task('build', () => {
  return gulp.src(['src/**'])
    .pipe(babel())
    .pipe(gulp.dest(`${buildPath}/src`));
});

gulp.task('build-tests', () => {
  return gulp.src('spec/**')
    .pipe(babel())
    .pipe(gulp.dest(`${buildPath}/spec`))
});

gulp.task('test', ['build', 'build-tests'], () => {
  return gulp.src(`${buildPath}/spec/*.js`)
    .pipe(jasmine());
});

gulp.task('test-dev', () => {
  gulp.watch(['src/**', 'spec/**'], ['test']);
});

gulp.task('package', ['test'], () => {
  gulp.src(`${buildPath}/src/*.js`)
    .pipe(gulp.dest(distPath));
});
