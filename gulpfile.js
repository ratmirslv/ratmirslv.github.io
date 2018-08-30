'use strict';

var gulp = require('gulp');
var del = require('del');
var svgmin = require('gulp-svgmin');
var htmlmin = require('gulp-htmlmin');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmin = require('gulp-csso');
// var imagemin = require('gulp-imagemin');
var browserSync = require("browser-sync").create();

gulp.task('clean', function () {
  return del(['*.html', 'css', 'img', 'fonts']);
});

gulp.task('copy', function () {
  return gulp.src('assets/**/*.{woff,woff2,png,jpg}', {base: './assets/'})
    .pipe(gulp.dest('./'));
});

// gulp.task('image', function () {
//   return gulp.src('assets/img/**/*.{png,jpg,svg}')
//     .pipe(imagemin([
//       imagemin.optipng({optimizationLevel: 1}),
//       imagemin.jpegtran({progressive: true}),
//       imagemin.svgo()
//       ]))
//     .pipe(gulp.dest('./img'));
// });

gulp.task('svgmin', function () {
    return gulp.src('assets/**/*.svg', {base: './assets/'})
        .pipe(svgmin())
        .pipe(gulp.dest('./'));
});

gulp.task('html', function() {
  return gulp.src('assets/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));
});

gulp.task('style', function () {
  return gulp.src('assets/css/*.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(cssmin())
    .pipe(gulp.dest('./css'))
});

gulp.task('build',
  gulp.series('clean',
  gulp.parallel('copy', 'svgmin', 'html', 'style'))
);

gulp.task('dev', function() {
  browserSync.init({
    server: '.'
  });
  gulp.watch('assets/**/*.{woff,woff2,png,jpg}', gulp.series('copy'));
  gulp.watch('assets/img/**/*.{svg}', gulp.series('svgmin'));
  gulp.watch('assets/*.html', gulp.series('html'));
  gulp.watch('assets/css/*.css', gulp.series('style'));
  browserSync.watch('./**/*.*').on('change', browserSync.reload);
});

gulp.task('default',
  gulp.series('clean',
  gulp.parallel('copy', 'svgmin', 'html', 'style'),
  'dev')
);
