'use strict'

angular.module('BB.Directives').directive 'bbDeals', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'DealList'

angular.module('BB.Controllers').controller 'DealList',
($scope,  $rootScope, DealService, $q, BBModel, DealModel, FormDataStoreService, ValidatorService) ->

  $scope.controller = "public.controllers.DealList"
  $scope.validator = ValidatorService
  $scope.notLoaded $scope

  $rootScope.connection_started.then ->
    init()
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  init = () ->
    $scope.notLoaded $scope
    if !$scope.deals
      deal_promise = DealService.query($scope.bb.company)
      deal_promise.then (deals) ->
        $scope.deals = deals
        $scope.setLoaded $scope



  $scope.selectDeal = (deal) ->
    iitem = new BBModel.BasketItem(null, $scope.bb)
    iitem.setDefaults($scope.bb.item_defaults)
    iitem.setDeal(deal)
    iitem.submitted = true
    $scope.bb.stackItem(iitem)
  

  $scope.removeDeal = (deal) ->
    $scope.bb.removeItemFromStack(deal)
    $scope.bb.basket.clearItem(deal)
    $scope.recipient_error = false
    if $scope.bb.current_item is deal
      $scope.bb.current_item = new BBModel.BasketItem(null, $scope.bb)
      $scope.current_item = $scope.bb.current_item
      $scope.setBasketItem(new BBModel.BasketItem(null, $scope.bb))


  $scope.addRecipient = (item, recipient) -> 
    if recipient.mail && recipient.name
      item.recipient = recipient.name
      item.recipient_mail = recipient.mail


  $scope.purchaseDeals = () ->
    if $scope.bb.stacked_items
      $scope.bb.pushStackToBasket()
      $scope.updateBasket().then () ->
        $scope.setLoaded $scope
        $scope.decideNextPage()
      , (err) ->
        $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
        $scope.decideNextPage()
    else
      AlertService.clear()
      AlertService.add("danger", { msg: "You need to select at least one Gift Certificate to continue" })
