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
});

gulp.task('scripts', ['clean', 'templateCache'], function() {
  return gulp.src(['./src/*/main.js.coffee', './src/**/*', './src/*/template.js', '!./**/*~', '!./src/*/templates/*', '!./src/*/images/*'])
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

gulp.task('watch', function() {
  gulp.watch(['./src/**/*', '!./**/*~'], ['scripts', 'images']);
});

gulp.task('webserver', function() {
  connect.server({
    root: ['release', 'examples', 'bower_components'],
    port: 8000
  });
});

gulp.task('default', ['scripts', 'watch', 'webserver']);
