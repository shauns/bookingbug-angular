'use strict';


angular.module('BBAdmin.Directives').directive 'bbTabletMoveBooking', () ->
  restrict: 'AE'
  replace: true
  scope: false
  controller : 'TabletMoveBooking'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletMoveBooking', ($scope,  $rootScope, $q, $modal, $state, $controller, AdminBookingService) ->
  $rootScope.connection_started.then ->
    prms = 
      company_id: $scope.bb.company_id
      id: $scope.booking_id
    
    prms.url = $scope.bb.api_url
    
    AdminBookingService.getBooking(prms).then (booking) ->
      $scope.booking = booking
      $scope.setLoaded $scope
      
    $scope.openModal = (template, time, extra) =>
      modalScope = $scope.$new(true)
      modalScope.bb_date = $scope.bb_date
      modalScope.time = time
      modalScope.person = extra.person
      modalScope.booking = $scope.booking
      modalScope.company_id = $scope.bb.company_id
    
      modalInstance = $modal.open
        templateUrl: template
        scope: modalScope

      modalInstance.result.then (result) =>
        if result
          $scope.notLoaded $scope
          start = modalScope.bb_date.date.clone().startOf('day')
          start.add('minutes', modalScope.time)
          prms.date = start.format('YYYY-MM-DD')
          prms.time = start.format('HH:mm')
          prms.person_id = modalScope.person.id
          
          AdminBookingService.updateBooking(prms, modalScope.booking).then (res) =>
            booking = res
            $scope.setLoaded $scope
            window.history.go(-2)
            