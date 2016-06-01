/* eslint-disable */
var babelPlugin = require('rollup-plugin-babel'),
    prerender = require('react-prerender'),
    browserSync = require('browser-sync'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    rollup = require('rollup'),
    gulp = require('gulp'),
    path = require('path'),
    fs = require('fs');

var config = {
  server: {
    files: ['build/**/*.html', 'build/**/*.js', 'build/**/*.css'],
    port: process.env.PORT || 3000,
    baseDir: 'build'
  },
  scss: {
    watch: 'src/css/**/*.scss',
    src: ['src/css/app.scss', 'src/css/critical.scss'],
    build: 'build/css',
    dist: 'dist/css'
  },
  html: {
    src: 'src/index.html',
    dist: 'dist',
    build: 'build',
    style: {
      dev: 'build/css/critical.css',
      prod: 'dist/css/critical.css'
    },
    minOptions: {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true
    }
  },
  rollup: {
    entry: 'src/js/main.js',
    bundle: {
      dest: 'build/js/main.js',
      format: 'amd'
    }
  }
};

//- Custom resolver for rollup
var resolver = function resolver () {
  return {
    resolveId: function (code, id) {
      if (id && code.search(/js\//) > -1) {
        return path.join(__dirname, 'src', code + '.js');
      }
    }
  };
};

gulp.task('sass-build', function () {
  return gulp.src(config.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.scss.build));
});

gulp.task('sass-watch', function () {
  gulp.watch(config.scss.watch, ['sass-build']);
});

gulp.task('sass-dist', function () {
  return gulp.src(config.scss.src)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(config.scss.dist));
});

gulp.task('html-inject-build', ['sass-build'], function () {
  return gulp.src(config.html.src)
    .pipe(replace('<!-- inject:critical.css -->', '<style>' + fs.readFileSync(config.html.style.dev, 'utf8') + '</style>'))
    .pipe(gulp.dest(config.html.build));
});

gulp.task('html-inject-dist', ['sass-dist'], function () {
  return gulp.src(config.html.src)
    .pipe(replace('<!-- inject:critical.css -->', '<style>' + fs.readFileSync(config.html.style.prod, 'utf8') + '</style>'))
    .pipe(htmlmin(config.html.minOptions))
    .pipe(gulp.dest(config.html.dist));
});

gulp.task('html-watch', function () {
  gulp.watch([config.html.src, config.html.style.dev], ['html-inject-build']);
});

gulp.task('rollup', function () {
  return rollup.rollup({
    entry: config.rollup.entry,
    plugins: [babelPlugin(), resolver()]
  }).then(function (bundle) {
    bundle.write(config.rollup.bundle);
  });
});

gulp.task('prerender', function () {
  var html = path.join(__dirname, 'dist/index.html'),
      rootComponent = 'js/components/App',
      mountQuery = '#react-mount',
      requirejs = {
        buildProfile: path.join(__dirname, 'rjs.build.js'),
        map: {
          moduleRoot: path.join(__dirname, 'build/js'),
          remapModule: 'js/config',
          ignorePatterns: [/esri\//, /dojo\//, /dijit\//]
        }
      };

  prerender({
    component: rootComponent,
    requirejs: requirejs,
    mount: mountQuery,
    target: html
  });
});

gulp.task('browser-sync', function () {
  var useHttps = process.env.SERVER === 'https';

  browserSync({
    server: config.server.baseDir,
    files: config.server.files,
    port: config.server.port,
    reloadOnRestart: false,
    logFileChanges: false,
    ghostMode: false,
    https: useHttps,
    open: false,
    ui: false
  });
});

gulp.task('serve', ['browser-sync']);
gulp.task('start', ['sass-build', 'sass-watch', 'html-inject-build', 'html-watch']);
gulp.task('dist', ['sass-dist', 'html-inject-dist', 'rollup']);
