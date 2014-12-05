'use strict';

angular.module('BB.Directives').directive 'bbAccordianRangeGroup', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'AccordianRangeGroup',


angular.module('BB.Controllers').controller 'AccordianRangeGroup',
($scope,  $rootScope, $q, FormDataStoreService) ->

  $scope.controller = "public.controllers.AccordianRangeGroup"
  $scope.collaspe_when_time_selected = true


  # store the form data for the following scope properties
  $scope.setFormDataStoreId = (id) ->
    FormDataStoreService.init ('AccordianRangeGroup'+id), $scope, []


  $scope.init = (start_time, end_time, options) ->
    $scope.setRange(start_time, end_time)
    $scope.collaspe_when_time_selected = if options && !options.collaspe_when_time_selected then false else true


  $scope.setRange = (start_time, end_time) ->
    $scope.start_time = start_time
    $scope.end_time   = end_time

    setData()


  setData = () ->
    $scope.accordian_slots = []
    $scope.is_open = $scope.is_open or false
    $scope.has_availability = $scope.has_availability or false
    $scope.is_selected = $scope.is_selected or false

    if $scope.day && $scope.day.slots
      $scope.slots = $scope.day.slots

    for slot in $scope.slots
      $scope.accordian_slots.push(slot) if slot.time >= $scope.start_time && slot.time < $scope.end_time

    updateAvailability()


  updateAvailability = () ->
    $scope.has_availability = false

    if $scope.accordian_slots
      $scope.has_availability = hasAvailability()
      # does the BasketItem's selected time reside in the accordian group?
      item = $scope.bb.current_item
      if item.time && item.time.time && item.time.time >= $scope.start_time && item.time.time < $scope.end_time && (item.date && item.date.date.isSame($scope.day.date))
        # lets just double check that time is still valid?
        found = false
        for slot in $scope.accordian_slots
          if slot.time == item.time.time
            item.setTime(slot)  # reset it - just in case this is really a new slot!
            found = true

        if !found
          # we failed to find this - possibly beceause we changed dates for
          # people - so unselect it!
          item.setTime(null)
        else
          # this will hide the accoridan heading and show selected time
          $scope.hideHeading = true
          $scope.is_selected = true
          $scope.is_open = false if $scope.collaspe_when_time_selected
      else
        $scope.is_selected = false
        $scope.is_open = false if $scope.collaspe_when_time_selected


  hasAvailability = ->
    return false if !$scope.accordian_slots

    for slot in $scope.accordian_slots
      return true if slot.availability() > 0

    return false


  $scope.$on 'slotChanged', (event) ->
    updateAvailability()

  $scope.$on 'dataReloaded', (event, earliest_slot) ->
    setData()

