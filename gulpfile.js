var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  size = require('gulp-filesize'),
  imagemin = require('gulp-imagemin'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
  sass = require('gulp-sass'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload;

var paths = {
  scripts: [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/jquery-color/jquery.color.js',
    'bower_components/socket.io-client/socket.io.js',
    'src/js/logviewer.js'
  ],
  scss: ['src/scss/*.scss']
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
  gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'));

  gulp.src('src/js/*.js')
    .pipe(gulp.dest('public/js'));
});

gulp.task('scripts:build', function(result) {
  gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(size());

  gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(size());
});

gulp.task('sass:dev', function() {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(reload({
      stream: true
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
    .pipe(gulp.dest('public/css'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('asserts', function() {
  gulp.src('src/favicon.ico').pipe(gulp.dest('public'));

  gulp.src('bower_components/bootstrap-sass/assets/fonts/**/*.*')
    .pipe(gulp.dest('public/fonts'));

  gulp.src('src/img/*.{jpg,png,gif}')
    .pipe(imagemin())
    .pipe(gulp.dest('public/img'))
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

gulp.task('nodemon', function() {
  nodemon({
    script: 'app.js',
    ext: 'js css',
    env: {
      'NODE_ENV': 'development'
    }
  }).on('restart', function() {
    console.log('restarted!')
  })
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts:dev']);
  gulp.watch(paths.scss, ['sass:dev']);
});

gulp.task('build', ['lint', 'scripts:build', 'sass:build', 'asserts']);

gulp.task('default', ['watch', 'scripts:dev', 'sass:dev', 'asserts', 'nodemon']);