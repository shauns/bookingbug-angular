'use strict';

angular.module('BB.Directives').directive 'bbSpaces', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'SpaceList'

angular.module('BB.Controllers').controller 'SpaceList',
($scope,  $rootScope, ServiceService, SpaceService, $q) ->
  $scope.controller = "public.controllers.SpaceList"
  $rootScope.connection_started.then =>
    if $scope.bb.company
      $scope.init($scope.bb.company)
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.init = (comp) =>
    SpaceService.query(comp).then (items) =>
      if $scope.currentItem.category
        # if we've selected a category for the current item - limit the list of servcies to ones that are relevant
        items = items.filter (x) -> x.$has('category') && x.$href('category') == $scope.currentItem.category.self
      $scope.items = items
      if (items.length == 1 && !$scope.allowSinglePick)
        $scope.skipThisStep()
        $rootScope.services = items
        $scope.selectItem(items[0], $scope.nextRoute )
      else
        $scope.listLoaded = true
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.selectItem = (item, route) =>
    $scope.currentItem.setService(item)
    $scope.decide_next_page(route)


