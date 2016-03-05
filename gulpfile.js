var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  size = require('gulp-filesize'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
  sass = require('gulp-sass'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload;

var paths = {
  mainjs: [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    'bower_components/jquery-color/jquery.color.js',
    'bower_components/socket.io-client/socket.io.js',
    'bower_components/moment/moment.js',
    'bower_components/bootstrap-daterangepicker/daterangepicker.js',
    'src/js/logviewer.js'
  ],
  scripts: ['src/js/*.js'],
  scss: ['src/scss/*.scss'],
  images: ['src/img/*.{jpg,png,gif}']
};

gulp.task('lint', function() {
  gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function(cb) {
  del(['public'], cb);
});

gulp.task('scripts:dev', function() {
  gulp.src(paths.mainjs)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'));

  gulp.src(paths.scripts)
    .pipe(gulp.dest('public/js'));
});

gulp.task('scripts:build', function(result) {
  gulp.src(paths.mainjs)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(size());

  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(size());
});

gulp.task('sass:dev', function() {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
});

gulp.task('sass:build', function() {
  gulp.src(paths.scss)
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: 'map'
    }, {
      errLogToConsole: true,
      sourceComments: 'map',
      sourceMap: 'sass'
    }))
    .pipe(uglifycss({
      "max-line-len": 120
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('asserts', function() {
  gulp.src('src/favicon.ico').pipe(gulp.dest('public'));

  gulp.src(paths.images)
    .pipe(gulp.dest('public/img'));
});

gulp.task('bs', ['nodemon'], function() {
  browserSync.init({
    proxy: {
      target: "http://localhost:3000",
      ws: true
    },
    port: 5000
  });

  gulp.watch(paths.scripts, ['scripts:dev'], browserSync.reload);
  gulp.watch(paths.scss, ['sass:dev'], browserSync.reload);
  gulp.watch(paths.images, ['asserts'], browserSync.reload);
  gulp.watch("views/**/*.jade").on('change', browserSync.reload);
});

gulp.task('nodemon', ['scripts:dev', 'sass:dev', 'asserts'], function() {
  nodemon({
    script: 'app.js',
    ext: 'js css'
  }).on('restart', function() {
    console.log('restarted!')
  })
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts:dev']);
  gulp.watch(paths.scss, ['sass:dev']);
  gulp.watch(paths.images, ['asserts']);
});

gulp.task('build', ['lint', 'scripts:build', 'sass:build', 'asserts']);

gulp.task('default', ['watch', 'nodemon']);