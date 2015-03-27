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
    if !$scope.deals or !$scope.bb.basket.containsDeal()
      deal_promise = DealService.query($scope.bb.company)
      deal_promise.then (deals) ->
        $scope.deals = deals
        $scope.setLoaded $scope


  $scope.selectDeal = (deal) ->
    $scope.recipient_error = false
    if !$scope.bb.current_item.submitted
      $scope.bb.current_item.setDefaults($scope.bb.item_defaults)
      $scope.bb.current_item.setDeal(deal)
      $scope.bb.current_item.submitted = true
      $scope.bb.stackItem($scope.bb.current_item)
      # $scope.bb.basket.items = $scope.bb.stacked_items
    else
      iitem = new BBModel.BasketItem(null, $scope.bb)
      iitem.setDefaults($scope.bb.item_defaults)
      iitem.setDeal(deal)
      iitem.submitted = true
      $scope.bb.stackItem(iitem)
      # $scope.bb.basket.items = $scope.bb.stacked_items
  

  $scope.removeDeal = (deal) ->
    $scope.bb.removeItemFromStack(deal)
    $scope.bb.basket.clearItem(deal)
    $scope.recipient_error = false
    if $scope.bb.current_item is deal
      $scope.bb.current_item = new BBModel.BasketItem(null, $scope.bb)
      $scope.current_item = $scope.bb.current_item
      $scope.setBasketItem(new BBModel.BasketItem(null, $scope.bb))


  $scope.addRecipient = (item, recipient) -> 
    console.log(recipient.mail)
    console.log(recipient.name)
    if recipient.mail && recipient.name
      item.recipient = recipient.name
      item.recipient_mail = recipient.mail
      console.log(item)
    else
      console.log("noooooo")
    # if item.recipient and item.recipient_mail
    #   item.recipient_submitted = true
    #   $scope.recipient_error = false
    # else
    #   $scope.recipient_error = true


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

