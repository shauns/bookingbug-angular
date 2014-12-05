'use strict'

angular.module('BB.Directives').directive 'bbEvents', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'EventList'


angular.module('BB.Controllers').controller 'EventList', ($scope,  $rootScope, EventService, $q, PageControllerService, FormDataStoreService) ->
  $scope.controller = "public.controllers.EventList"
  $scope.notLoaded $scope
  angular.extend(this, new PageControllerService($scope, $q))

  FormDataStoreService.init 'EventList', $scope, [
    'event_group_set',
  ]
  $scope.$setIfUndefined 'event_group_set', false
  $scope.start_date = moment()
  $scope.end_date   = moment().add(1, 'year')
  $scope.event_group_set = if !$scope.event_group_set then false else $scope.current_item.event_group?


  $rootScope.connection_started.then ->
    if $scope.bb.company
      $scope.init($scope.bb.company)
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
  
  $scope.fully_booked = false

  $scope.init = (comp) ->

    if $scope.current_item.event
      delete $scope.current_item.event
      delete $scope.current_item.event_group if !$scope.event_group_set
      delete $scope.current_item.event_chain

    $scope.notLoaded $scope
    comp ||= $scope.bb.company 
    params = {item: $scope.bb.current_item, start_date:$scope.start_date.format("YYYY-MM-DD"), end_date:$scope.end_date.format("YYYY-MM-DD")}
    EventService.query(comp, params).then (items) ->
      $scope.items = items
      full_events = []
      for item in items
        item.getDuration()
        if item.num_spaces == item.spaces_booked
          full_events.push(item)
      if (full_events.length) == items.length
        $scope.fully_booked = true
      $scope.setLoaded $scope
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.selectItem = (item, route) =>
    return false unless item.hasSpace()
    $scope.notLoaded $scope
    if $scope.$parent.$has_page_control
      $scope.event = item
      $scope.setLoaded $scope
      return false
    else
      $scope.bb.current_item.setEvent(item)
      $scope.bb.current_item.ready = false
      $q.all($scope.bb.current_item.promises).then () ->
        $scope.decideNextPage(route)
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
      return true
