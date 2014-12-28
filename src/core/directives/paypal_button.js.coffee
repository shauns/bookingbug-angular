'use strict';

# Directives
app = angular.module 'BB.Directives'

app.directive 'bbPaypal', (PathSvc) ->
  restrict: 'A'
  replace: true
  scope : {
    ppDetails : "=bbPaypal"
  }
  templateUrl : PathSvc.directivePartial "paypal_button"
  link : (scope, element, attrs) ->
    scope.inputs = []

    if !scope.ppDetails
      return

    keys = _.keys scope.ppDetails
    #  convert the paypal data to an array of input objects
    _.each keys, (keyName) ->
      obj = {
        name : keyName
        value : scope.ppDetails[keyName]
      }
      scope.inputs.push obj




