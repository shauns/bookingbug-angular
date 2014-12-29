'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletCustomers', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletCustomers'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletCustomers', ($scope,  $rootScope, $q, AdminBookingService) ->
  
  $scope.open_datepicker = ($event) ->
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened_datepicker = true

  $rootScope.connection_started.then ->
    $scope.updateCal()

  $scope.$on 'dateChanged', (event, newdate) =>
    $scope.updateCal()

  $scope.updateCal = () =>
    return if !$scope.bb_date.date
    
    $scope.notLoaded $scope
    prms = 
      company_id: $scope.bb.company_id
      date: $scope.bb_date.date.format('YYYY-MM-DD')
      include_cancelled: true
    
    prms.url = $scope.bb.api_url
    
    AdminBookingService.query(prms).then (bookings) ->
      $scope.bookings = bookings
      $scope.setLoaded $scope
      $scope.setPageLoaded()
