'use strict';

# Directives
app = angular.module 'BB.Directives'

# Used to load the application's content. It uses ng-include.
app.directive 'bbContentNew', (PathSvc) ->
  restrict: 'A'
  replace: true
  scope : true
  templateUrl : PathSvc.directivePartial "content_main"
  controller : ($scope)->
    $scope.initPage = ->
      $scope.$eval('setPageLoaded()')
    return