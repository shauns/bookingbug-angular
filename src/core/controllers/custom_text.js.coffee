'use strict';



angular.module('BB.Directives').directive 'bbCustomBookingText', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'CustomBookingText'


angular.module('BB.Controllers').controller 'CustomBookingText', ($scope,  $rootScope, CustomTextService, $q) ->
  $scope.controller = "public.controllers.CustomBookingText"
  $scope.notLoaded $scope

  $rootScope.connection_started.then =>
    CustomTextService.BookingText($scope.bb.company, $scope.bb.current_item).then (msgs) =>
      $scope.messages = msgs
      $scope.setLoaded $scope
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')



angular.module('BB.Directives').directive 'bbCustomConfirmationText', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'CustomConfirmationText'


angular.module('BB.Controllers').controller 'CustomConfirmationText', ($scope, $rootScope, CustomTextService, $q, PageControllerService) ->
  $scope.controller = "public.controllers.CustomConfirmationText"
  $scope.notLoaded $scope

  $rootScope.connection_started.then ->
    $scope.loadData()
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.loadData = () =>

    if $scope.total

      CustomTextService.confirmationText($scope.bb.company, $scope.total).then (msgs) ->
        $scope.messages = msgs
        $scope.setLoaded $scope
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

    else if $scope.loadingTotal

      $scope.loadingTotal.then (total) ->
        CustomTextService.confirmationText($scope.bb.company, total).then (msgs) ->
          $scope.messages = msgs
          $scope.setLoaded $scope
        , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

    else
      $scope.setLoaded $scope

