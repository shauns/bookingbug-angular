'use strict'

angular.module('BB.Directives').directive 'bbProductList', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'ProductList'
  link : (scope, element, attrs) ->
    if attrs.bbItem
      scope.booking_item = scope.$eval( attrs.bbItem )
    if attrs.bbShowAll
      scope.show_all = true
    return

angular.module('BB.Controllers').controller 'ProductList', ($scope,
    $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService,
    PageControllerService, halClient) ->

  $scope.controller = "public.controllers.ProductList"

  $scope.notLoaded $scope

  $scope.validator = ValidatorService

  $rootScope.connection_started.then ->
    if $scope.bb.company
      $scope.init($scope.bb.company)
  , (err) ->
    $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.init = (company) ->
    $scope.booking_item ||= $scope.bb.current_item

    company.$get('products').then (products) ->
      products.$get('products').then (products) ->
        $scope.products = products
        $scope.setLoaded $scope

  $scope.selectItem = (item, route) ->
    if $scope.$parent.$has_page_control
      $scope.product = item
      false
    else
      $scope.booking_item.setProduct(item)
      $scope.decideNextPage(route)
      true

