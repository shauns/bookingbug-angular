'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletTimeslot', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletTimeslot'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletTimeslot', ($scope,  $rootScope, $q, $filter, $modal, AdminTimeService, AdminBookingService) ->
  $scope.bb_date.js_date = new Date($scope.date)
  time = parseInt($scope.time)
  
  $scope.$on 'dateChanged', (event, newdate) =>
    $scope.timeslot = $scope.bb_date.date.utc().add('minutes', time)
    $scope.updateAll()
    
  $scope.$on "$destroy", =>
    $scope.clearClient() if $scope.clearClient?
  
  $scope.updateAll = () =>
    $scope.notLoaded $scope
    $scope.bb.company.getPeoplePromise().then (people) ->
      people = people.filter (p) -> p.$has('enabled_services')
      people = $filter('orderBy')(people, 'order')
      $scope.people = people    
      prms = { company_id: $scope.bb.company_id, date: $scope.date }
      prms.url = $scope.bb.api_url
  
      refreshBookings = =>
        relevantBookings = $filter('filter')($scope.bookings.items, (booking) ->
          ret = (booking.start.minutes() + (booking.start.hours() * 60) <= time)
          ret &= (booking.end.minutes() + (booking.end.hours() * 60) > time)
          ret
        )
        for booking in relevantBookings 
          if booking.status != 4
            $scope.personStatus[booking.person_id] = { blocked: true, booking: null }
          else
            $scope.personStatus[booking.person_id] = { booking: booking }
      
      $scope.personStatus = {}
      AdminBookingService.query(prms).then (bookings) ->
        bookings.addCallback $scope, (booking, status) =>
          # Blank out booking attributes
          if $scope.personStatus[person.id]?
            $scope.personStatus[person.id].booking = null
            $scope.personStatus[person.id].blocked = false
            
          refreshBookings()
    
        $scope.bookings = bookings
        refreshBookings()
        peoplePromises = []
      
        for person in $scope.people
          t_prms = prms
          t_prms.person_id = person.id
      
          peoplePromises.push AdminTimeService.query(t_prms).then (res) ->
            person_id = res.person_id
            $scope.personStatus[person_id] = {} if !$scope.personStatus[person_id]?
            timeItem = $filter('filter')(res, { time: $scope.time })[0]
            $scope.personStatus[person_id].available = timeItem? &&  (timeItem.avail != 0)
              
        $q.all(peoplePromises).then ->
          $scope.setLoaded $scope
          $scope.setPageLoaded()
              
        $scope.addBooking = (person) =>
          $scope.clearClient()
          
          modalScope = $scope.$new(true)
          modalScope.time = $scope.time
          modalScope.person = person
          modalScope.company_id = $scope.bb.company.id
          modalScope.bb_date = $scope.bb_date
          
          modalInstance = $modal.open
            scope: modalScope,
            templateUrl: "/angular/partials/tablet/add_booking.html",
            windowClass: "model-large"
          
          modalScope.$on "processDone", () =>
            modalInstance.close()
