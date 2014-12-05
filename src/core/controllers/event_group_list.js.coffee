'use strict';

angular.module('BB.Directives').directive 'bbEventGroups', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'EventGroupList'
  link : (scope, element, attrs) ->
    if attrs.bbItem
      scope.booking_item = scope.$eval( attrs.bbItem )
    if attrs.bbShowAll
      scope.show_all = true
    return


angular.module('BB.Controllers').controller 'EventGroupList',
($scope,  $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService,
  PageControllerService, halClient) ->

  $scope.controller = "public.controllers.EventGroupList"
  FormDataStoreService.init 'EventGroupList', $scope, [
    'event_group'
  ]
  $scope.notLoaded $scope
  angular.extend(this, new PageControllerService($scope, $q))

  $scope.validator = ValidatorService

  $rootScope.connection_started.then =>
    if $scope.bb.company
      $scope.init($scope.bb.company)
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.init = (comp) ->
    $scope.booking_item ||= $scope.bb.current_item
    ppromise = comp.getEventGroupsPromise()

    ppromise.then (items) ->
      # not all service lists need filtering. check for attribute first
      filterItems = if $attrs.filterServices is 'false' then false else true

      if filterItems
        if $scope.booking_item.service_ref && !$scope.show_all
          items = items.filter (x) -> x.api_ref is $scope.booking_item.service_ref
        else if $scope.booking_item.category && !$scope.show_all
          # if we've selected a category for the current item - limit the list
          # of services to ones that are relevant
          items = items.filter (x) -> x.$has('category') && x.$href('category') is $scope.booking_item.category.self

      if (items.length is 1 && !$scope.allowSinglePick)
        if !$scope.selectItem(items[0], $scope.nextRoute )
          setEventGroupItem items
        else
          $scope.skipThisStep()
      else
        setEventGroupItem items

      # if there's a default - pick it and move on
      if $scope.booking_item.defaultService()
        for item in items
          if item.self == $scope.booking_item.defaultService().self
            $scope.selectItem(item, $scope.nextRoute )

      # if there's one selected - just select it
      if $scope.booking_item.event_group
        for item in items
          item.selected = false
          if item.self is $scope.booking_item.event_group.self
            $scope.event_group = item
            item.selected = true
            $scope.booking_item.setEventGroup($scope.event_group)

      $scope.setLoaded $scope

      if $scope.booking_item.event_group || (!$scope.booking_item.person && !$scope.booking_item.resource)
        # the "bookable services" are the event_group unless we've pre-selected something!
        $scope.bookable_services = $scope.items
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')




  # set the event_group item so the correct item is displayed in the dropdown menu.
  # without doing this the menu will default to 'please select'
  setEventGroupItem = (items) ->
    $scope.items = items
    if $scope.event_group
        _.each items, (item) ->
          if item.id is $scope.event_group.id
            $scope.event_group = item


  $scope.selectItem = (item, route) =>
    if $scope.$parent.$has_page_control
      $scope.event_group = item
      return false
    else
      $scope.booking_item.setEventGroup(item)
      $scope.decideNextPage(route)
      return true

  $scope.$watch 'event_group', (newval, oldval) =>
    if $scope.event_group
      if !$scope.booking_item.event_group or $scope.booking_item.event_group.self isnt $scope.event_group.self
        # only set and broadcast if it's changed
        $scope.booking_item.setEventGroup($scope.event_group)
        $scope.broadcastItemUpdate()


  $scope.setReady = () =>
    if $scope.event_group
      $scope.booking_item.setEventGroup($scope.event_group)
      return true
    else
      return false

