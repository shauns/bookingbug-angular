(function (angular) {
  'use strict';

  /* Directives */
  var app = angular.module('BB.Directives');

  app.directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });
}(window.angular));
