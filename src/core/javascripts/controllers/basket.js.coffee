'use strict';


# TODO: Try and get all the baset logic into a service. The basket list
# doesn't look like it's used anywhere.
angular.module('BB.Directives').directive 'bbMiniBasket', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'MiniBasket'


angular.module('BB.Controllers').controller 'MiniBasket', ($scope,  $rootScope, BasketService, $q) ->
  $scope.controller = "public.controllers.MiniBasket"
  $scope.setUsingBasket(true)
  $rootScope.connection_started.then () =>

  $scope.basketDescribe = (nothing, single, plural) =>
    if !$scope.bb.basket || $scope.bb.basket.length() == 0
      nothing
    else if $scope.bb.basket.length() == 1
      single
    else
      plural.replace("$0", $scope.bb.basket.length())





angular.module('BB.Directives').directive 'bbBasketList', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'BasketList'


angular.module('BB.Controllers').controller 'BasketList', ($scope,  $rootScope, BasketService, $q, AlertService) ->
  $scope.controller = "public.controllers.BasketList"
  $scope.setUsingBasket(true)
  $scope.items = $scope.bb.basket.items

  $scope.$watch 'basket', (newVal, oldVal) =>
    $scope.items = $scope.bb.basket.items

  $scope.addAnother = (route) =>
    $scope.clearBasketItem()
    $scope.bb.current_item.setCompany($scope.bb.company)
    $scope.decideNextPage(route)

  $scope.checkout = (route) =>
    $scope.setReadyToCheckout(true)
    $scope.decideNextPage(route)


  $scope.applyCoupon = (coupon) =>
    params = {bb: $scope.bb, coupon: coupon }
    BasketService.applyCoupon($scope.bb.company, params).then (basket) ->

      for item in basket.items
        item.storeDefaults($scope.bb.item_defaults)
        item.reserve_without_questions = $scope.bb.reserve_without_questions
      basket.setSettings($scope.bb.basket.settings)
      $scope.setBasket(basket)
    , (err) ->
      if err && err.data && err.data.error
        AlertService.clear()
        AlertService.add("danger", { msg: err.data.error })
      console.log(err)