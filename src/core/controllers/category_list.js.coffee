'use strict';

angular.module('BB.Directives').directive 'bbCategories', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'CategoryList'


angular.module('BB.Controllers').controller 'CategoryList',
($scope,  $rootScope, CategoryService, $q, PageControllerService) ->
  $scope.controller = "public.controllers.CategoryList"
  $scope.notLoaded $scope

  angular.extend(this, new PageControllerService($scope, $q))

  $rootScope.connection_started.then =>
    if $scope.bb.company
      $scope.init($scope.bb.company)
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.init = (comp) =>
    CategoryService.query(comp).then (items) =>
      $scope.items = items
      if (items.length == 1)
        $scope.skipThisStep()
        $rootScope.categories = items
        $scope.selectItem(items[0], $scope.nextRoute )
      $scope.setLoaded $scope
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.selectItem = (item, route) =>
    $scope.bb.current_item.setCategory(item)
    $scope.decideNextPage(route)

