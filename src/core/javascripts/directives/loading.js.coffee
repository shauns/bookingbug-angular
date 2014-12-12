'use strict';

# Directives
app = angular.module 'BB.Directives'

# TODO: This needs to be replaced with the loader directive. This is used in
# other pages other than main.html.erb, so make sure they are all changed.
app.directive 'bbLoading', ($compile) ->
  transclude: false,
  restrict: 'A',
  link: (scope, element, attrs) ->
    scope.scopeLoaded = true
    element.attr('ng-hide',"scopeLoaded")
    element.attr('bb-loading',null)
    $compile(element)(scope)
    return