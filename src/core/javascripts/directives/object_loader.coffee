'use strict';

# Directives
app = angular.module 'BB.Directives'


app.directive 'script', ($compile, halClient) ->
  transclude: false,
  restrict: 'E',
  link: (scope, element, attrs) ->
    if (attrs.type == 'text/hal-object')
      body = element[0].innerText
      json = $bbug.parseJSON(body)
      res = halClient.$parse(json)
