

angular.module('BB.Directives').directive 'bbToggleEdit', ($compile, $window, $document) ->
  restrict: 'AE',
  link: (scope, element, attr) ->
    scope.editing = false
    element.on 'dblclick', (event) =>
      scope.$apply () ->
        scope.editing = true

    $document.on 'click', () =>
      if !element.is(':hover')
        scope.$apply () ->
          scope.editing = false

    true  


