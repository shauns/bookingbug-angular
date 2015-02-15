'use strict';


angular.module('BBAdmin.Directives').directive 'bbDashboardBooking', ->
  restrict: 'AE'
  replace: true
  scope: {
    avail: '=available'
    booking: '='
    person: '='
    time: '='
    allDayBlocking: '='
    first: '='
    numServices: '='
  }

  templateUrl: (tElm, tAttrs) ->
    tAttrs.template
  
  controller: ($scope) ->
    $scope.openModal = $scope.$parent.openModal
    $scope.$watchCollection '[booking, allDayBlocking, avail, first]', (newValues) ->    
      booking = newValues[0]
      $scope.completed = false
      $scope.checked_in = false
      $scope.being_seen = false
      $scope.no_show = false
      $scope.blocking = newValues[1]
      $scope.blocked = newValues[1]?
      $scope.allDay = false
      $scope.allDay |= booking.allDay if booking?
      $scope.allDay |= $scope.blocking?
      $scope.available = newValues[2]
      $scope.showHeader = newValues[3] || !$scope.blocked
    
      if (booking?)
        $scope.blocked |= booking.status != 4
        $scope.blocking = booking
        
        if booking.multi_status? && !$scope.blocked
          $scope.completed = booking.hasStatus('completed')
          $scope.checked_in = booking.hasStatus('checked_in')
          $scope.no_show = booking.hasStatus('no_show')
          $scope.being_seen = booking.hasStatus('being_seen')
        
        start = booking.start.minutes() + (booking.start.hours() * 60)
        $scope.showHeader = (start == $scope.time)
