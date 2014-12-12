var gulp = require('gulp');
    coffee = require('gulp-coffee');
    concat = require('gulp-concat');
    gulpif = require('gulp-if');
    filelog = require('gulp-filelog');
    gutil = require('gulp-util');
    del = require('del');
    connect = require('gulp-connect');
    templateCache = require('gulp-angular-templatecache');
    imagemin = require('gulp-imagemin');
    rename = require('gulp-rename');
    flatten = require('gulp-flatten');
    sass = require('gulp-sass');
    merge = require('merge-stream');
    mainBowerFiles = require('main-bower-files');

gulp.task('clean', function(cb) {
  del(['release'], cb);
});

gulp.task('templateCache', function() {
  gulp.src('./src/member/templates/**/*.html')
    .pipe(templateCache('templates.js', {module: 'BBMember'}))
    .pipe(gulp.dest('./src/member/'));
  gulp.src('./src/person-table/templates/**/*.html')
    .pipe(templateCache('templates.js', {module: 'BBPersonTable'}))
    .pipe(gulp.dest('./src/person-table'));
  gulp.src('./src/widget/templates/**/*.html')
    .pipe(templateCache('templates.js', {module: 'BB'}))
    .pipe(gulp.dest('./src/widget'));
  gulp.src('./src/admin-table/templates/**/*.html')
    .pipe(templateCache('templates.js', {module: 'BBAdminTable'}))
    .pipe(gulp.dest('./src/admin-table'));
});

gulp.task('scripts', function() {
  gulp.src(mainBowerFiles({filter: new RegExp('.js$')}).concat(['./src/core/main.js.coffee', './src/*/main.js.coffee', './src/core/services/widget.js.coffee', './src/core/collections/base.js.coffee', './src/widget/templates.js', './src/**/*', './src/*/templates.js', '!./**/*~', '!./src/*/templates/*', '!./src/*/images/*', '!./src/*/stylesheets/**']))
    // .pipe(filelog())
    .pipe(gulpif(/.*coffee$/, coffee().on('error', function (e) {
      gutil.log(e)
      this.emit('end')
    })))
    .pipe(concat('bookingbug-angular.js'))
    .pipe(gulp.dest('release'));
});

gulp.task('images', function() {
  return gulp.src('src/*/images/*')
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest('release'));
});

gulp.task('stylesheets', function() {
  return gulp.src('src/*/stylesheets/main.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(flatten())
    .pipe(gulp.dest('release'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*', '!./**/*~', '!./**/templates.js'], ['assets']);
});

gulp.task('webserver', function() {
  connect.server({
    root: ['release', 'examples', 'bower_components'],
    port: 8000
  });
});

gulp.task('assets', ['clean', 'templateCache', 'scripts', 'images', 'stylesheets']);

gulp.task('default', ['assets', 'watch', 'webserver']);
