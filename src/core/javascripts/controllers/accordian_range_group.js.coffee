'use strict';

angular.module('BB.Directives').directive 'bbAccordianRangeGroup', () ->
  restrict: 'AE'
  replace: true
  scope: true
  require: '^?bbTimeRangeStacked'
  controller: 'AccordianRangeGroup'
  link: (scope, element, attrs, ctrl) ->
    scope.options = scope.$eval(attrs.bbAccordianRangeGroup) or {}
    scope.options.using_stacked_items = ctrl?


angular.module('BB.Controllers').controller 'AccordianRangeGroup',
($scope, $attrs, $rootScope, $q, FormDataStoreService) ->

  $scope.controller = "public.controllers.AccordianRangeGroup"
  $scope.collaspe_when_time_selected = true

  $rootScope.connection_started.then ->
    $scope.init($scope.options.range[0], $scope.options.range[1], $scope.options) if $scope.options and $scope.options.range


  # store the form data for the following scope properties
  $scope.setFormDataStoreId = (id) ->
    FormDataStoreService.init ('AccordianRangeGroup'+id), $scope, []


  $scope.init = (start_time, end_time, options) ->
    $scope.setRange(start_time, end_time)
    $scope.collaspe_when_time_selected = if options && !options.collaspe_when_time_selected then false else true


  $scope.setRange = (start_time, end_time) ->
    if !$scope.options
      $scope.options = $scope.$eval($attrs.bbAccordianRangeGroup) or {}
    $scope.start_time = start_time
    $scope.end_time   = end_time
    setData()


  setData = () ->
    $scope.accordian_slots = []
    $scope.is_open = $scope.is_open or false
    $scope.has_availability = $scope.has_availability or false
    $scope.is_selected = $scope.is_selected or false

    if $scope.options and $scope.options.slots
      $scope.source_slots = $scope.options.slots
    else if ($scope.day and $scope.day.slots)
      $scope.source_slots = $scope.day.slots
    else
      $scope.source_slots = null

    if $scope.source_slots

      if angular.isArray($scope.source_slots)
        for slot in $scope.source_slots
          $scope.accordian_slots.push(slot) if slot.time >= $scope.start_time and slot.time < $scope.end_time
      else
        for key, slot of $scope.source_slots
          $scope.accordian_slots.push(slot) if slot.time >= $scope.start_time and slot.time < $scope.end_time

      updateAvailability()


  updateAvailability = (day, slot) ->   
    $scope.selected_slot = null
    $scope.has_availability = hasAvailability() if $scope.accordian_slots

    # if a day and slot has been provided, check if the slot is in range
    if day and slot
      $scope.selected_slot = slot if day.date.isSame($scope.day.date) and slot.time >= $scope.start_time and slot.time < $scope.end_time
    else 
      for slot in $scope.accordian_slots
        if slot.selected
          $scope.selected_slot = slot
          break

    if $scope.selected_slot
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


  $scope.$on 'slotChanged', (event, day, slot) ->  
    if day and slot
      updateAvailability(day, slot)
    else
      updateAvailability()


  $scope.$on 'dataReloaded', (event, earliest_slot) ->
    setData()

