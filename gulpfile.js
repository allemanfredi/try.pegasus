'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const del = require('del');

const file = {
  html:   'src/**/*.html',
  js:     'src/assets/js/src/**/*.js',
}

const page = {
  js:     'src/assets/js/src/page.js',
}

const dir = {
  css:    'src/assets/css/',
  js:     'src/assets/js/',
  font:   'src/assets/fonts/',
}



/*
|--------------------------------------------------------------------------
| Serve
|--------------------------------------------------------------------------
|
*/
function reload(done) {
  browserSync.reload();
  done();
};

function serve(done) {
  browserSync({
    server: 'src/'
  });

  gulp.watch( file.js, gulp.series(js, reload));
  gulp.watch( file.html, reload );
  done();
};


function js() {
  return gulp.src(page.js)
    .pipe(webpack({
      mode: 'none',
      devtool: 'source-map',
      output: {
        filename: 'page.min.js'
      }
    }))
    .pipe( gulp.dest(dir.js) );

};

function jsProductionMinified() {
  return gulp.src(page.js)
    .pipe(webpack({
      mode: 'production',
      devtool: 'source-map',
      output: {
        filename: 'page.min.js'
      },
      performance: {
        hints: false
      }
    }))
    .pipe( gulp.dest(dir.js) );
};

function jsProductionExpanded() {
  return gulp.src(page.js)
    .pipe(webpack({
      mode: 'none',
      devtool: 'source-map',
      output: {
        filename: 'page.js'
      }
    }))
    .pipe( gulp.dest(dir.js) );
};

function copyFonts(done) {
  //gulp.src( 'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*').pipe(gulp.dest(dir.font));
  gulp.src( 'node_modules/font-awesome/fonts/*').pipe(gulp.dest(dir.font));
  gulp.src( 'node_modules/themify-icons/themify-icons/fonts/*').pipe(gulp.dest(dir.font));
  gulp.src( 'node_modules/et-line/fonts/*').pipe(gulp.dest(dir.font));
  done();
};

function distCopy() {
  return gulp.src( ['src/**/*', '!src/assets/{js/src,plugin/thesaas,}{,/**}'] ).pipe(gulp.dest('dist/'));
};


function distClean() {
  return del('dist/');
};

function img() {
  return gulp.src('src/assets/img/**/*.{jpg,jpeg,png,gif}')
    .pipe( imagemin() )
    .pipe( gulp.dest('src/assets/img/') );
};


function setProductionMode(done) {
  production = true;
  done();
}

function setDevMode(done) {
  production = false;
  done();
}



exports.dev     = gulp.series(copyFonts,js);
exports.dist    = gulp.series(setProductionMode, distClean, copyFonts, jsProductionMinified, jsProductionExpanded, distCopy, setDevMode);
exports.watch   = serve;
exports.default = serve;
