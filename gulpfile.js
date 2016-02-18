var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  size = require('gulp-filesize'),
  imagemin = require('gulp-imagemin'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload;

gulp.task('lint', function() {
  gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: 'map'
    }, {
      errLogToConsole: true
    }))
    .pipe(prefix("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
    .pipe(gulp.dest('./public/css'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('compress', function() {
  gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
    .pipe(size());

  gulp.src('./src/css/*.css')
    .pipe(uglifycss({
      "max-line-len": 80
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(size());
});

gulp.task('images', function() {
  gulp.src('./src/favicon.ico').pipe(gulp.dest('./public'));

  gulp.src('./src/img/*.{jpg,png,gif}')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/img'))
    .pipe(size());
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:5000",
    files: ["public/**/*.*"],
    browser: "google chrome",
    port: 7000,
  });
});

gulp.task('nodemon', function(cb) {
  return nodemon({
    script: 'app.js'
  }).once('start', cb);
});

gulp.task('build', ['lint', 'compress', 'images']);

gulp.task('default', ['browser-sync'], function() {
  // gulp.watch("./src/scss/*.scss", ['sass']);
  gulp.watch(["./src/js/**/*.js", "./*.html"], reload);
});