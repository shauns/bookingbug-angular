'use strict'

angular.module('BB.Directives').directive 'bbTimeSlots', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TimeSlots'
  link : (scope, element, attrs) ->
    if attrs.bbItem
      scope.booking_item = scope.$eval( attrs.bbItem )
    if attrs.bbShowAll
      scope.show_all = true
    return

angular.module('BB.Controllers').controller 'TimeSlots', ($scope,
    $rootScope, $q, $attrs, SlotService, FormDataStoreService, ValidatorService,
    PageControllerService, halClient, BBModel) ->

  $scope.controller = "public.controllers.SlotList"

  $scope.notLoaded $scope
  $rootScope.connection_started.then ->
    if $scope.bb.company
      $scope.init($scope.bb.company)
  , (err) ->
    $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.init = (company) ->
    $scope.booking_item ||= $scope.bb.current_item
    $scope.start_date = moment()
    $scope.end_date = moment().add(1, 'month')

    SlotService.query($scope.bb.company, {item: $scope.booking_item,  start_date:$scope.start_date.format("YYYY-MM-DD"), end_date:$scope.end_date.format("YYYY-MM-DD")}).then (slots) ->
      $scope.slots = slots
      $scope.setLoaded $scope
    , (err) ->
      $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  setItem = (slot) ->
    $scope.booking_item.setSlot(slot)

  
  $scope.selectItem = (slot, route) ->
    if $scope.$parent.$has_page_control
      setItem(slot)
      false
    else
      setItem(slot)
      $scope.decideNextPage(route)
      true

