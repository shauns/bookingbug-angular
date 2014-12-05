'use strict';

angular.module('BB.Directives').directive 'bbPurchaseTotal', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'PurchaseTotal'


angular.module('BB.Controllers').controller 'PurchaseTotal',
($scope, $rootScope, $window, PurchaseTotalService, $q) ->
  $scope.controller = "public.controllers.PurchaseTotal"

  angular.extend(this, new $window.PageController($scope, $q))

  $scope.load = (total_id) =>
    $rootScope.connection_started.then =>
      $scope.loadingTotal = PurchaseTotalService.query({company: $scope.bb.company, total_id: total_id})
      $scope.loadingTotal.then (total) =>
        $scope.total = total

