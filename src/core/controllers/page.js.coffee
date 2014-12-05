'use strict';

BBBasicPageCtrl = ($scope, $q, ValidatorService) ->
  # dont' give this $scope a 'controller' property as it's used for controller
  # inheritance, so the $scope agument is not injected but passed in as an
  # argument, so it would overwrite the property set elsewhere
  $scope.controllerClass = "public.controllers.PageController"
  $scope.$has_page_control = true

  $scope.validator = ValidatorService

  # go around child scopes - return false if *any* child scope is marked as isLoaded = false
  isScopeReady = (cscope) =>
    ready_list = []

    children = []
    child = cscope.$$childHead
    while (child)
      children.push(child)
      child = child.$$nextSibling

    children.sort (a,b) ->
      return if (a.ready_order || 0) >= (b.ready_order || 0) then 1 else -1

    for child in children
      ready = isScopeReady(child)
      if angular.isArray(ready)
        Array::push.apply ready_list, ready
      else
        ready_list.push(ready)

    if cscope.hasOwnProperty('setReady')
      ready_list.push(cscope.setReady())

    ready_list


  $scope.checkReady = () ->
    ready_list = isScopeReady($scope)
    checkread = $q.defer()
    $scope.$checkingReady = checkread.promise;


    ready_list = ready_list.filter (v) -> !((typeof v == 'boolean') && v)

    # if the ready list if empty - mark it as all good
    if !ready_list || ready_list.length == 0
      checkread.resolve()
      return true

    for v in ready_list
      if (typeof value == 'boolean') || !v
        checkread.reject()
        return false

    $scope.notLoaded $scope
    $q.all(ready_list).then () ->
      $scope.setLoaded $scope
      checkread.resolve()
    , (err) ->  $scope.setLoaded $scope
    return true


  $scope.routeReady = (route) ->
    if !$scope.$checkingReady
      $scope.decideNextPage(route)
    else
      $scope.$checkingReady.then () =>
        $scope.decideNextPage(route)


angular.module('BB.Directives').directive 'bbPage', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'PageController'


angular.module('BB.Controllers').controller 'PageController', BBBasicPageCtrl
angular.module('BB.Services').value "PageControllerService", BBBasicPageCtrl

