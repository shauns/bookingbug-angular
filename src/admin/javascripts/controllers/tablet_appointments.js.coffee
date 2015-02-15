'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletAppointments', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletAppointments'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletAppointments', ($scope,  $rootScope, $q, $filter, AdminTimeService, AdminBookingService, AdminSlotService) ->
  
  $scope.open_datepicker = ($event) ->
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened_datepicker = true;

  $rootScope.connection_started.then ->
    $scope.notLoaded $scope
    $scope.bb.company.getPeoplePromise().then (people) ->
      people = people.filter (p) -> p.$has('enabled_services')
      people = $filter('orderBy')(people, 'order')
      $scope.people = people
      $scope.updateCal()

  $scope.$on 'dateChanged', (event, newdate) =>
    $scope.updateCal()

  $scope.updateCal = () =>
    return if !$scope.bb_date.date || !$scope.people
    
    $scope.notLoaded $scope
    prms = { company_id: $scope.bb.company_id, date: $scope.bb_date.date.format('YYYY-MM-DD') }
    prms.url = $scope.bb.api_url
    
    $scope.allTimes = []
    $scope.peopleSlots = {}
    $scope.timesWithPeopleFree = {}
    allPromises = []
    for person in $scope.people
      t_prms = prms
      t_prms.person_id = person.id
      
      allPromises.push AdminTimeService.query(prms).then (res) =>
        personID = res.person_id
        $scope.peopleSlots[personID] = res
        for timeItem in res 
          $scope.allTimes.push(timeItem.time) if timeItem.time not in $scope.allTimes
          if !$scope.timesWithPeopleFree[timeItem.time]?
            $scope.timesWithPeopleFree[timeItem.time] = []
          if (timeItem.avail > 0) && !(personID in $scope.timesWithPeopleFree[timeItem.time])
            $scope.timesWithPeopleFree[timeItem.time].push personID
            
    bookings = AdminBookingService.query(prms)
    allPromises.push bookings.then (res) =>
      $scope.bookings = res
      for booking in res.items
        time = booking.start.minutes() + (booking.start.hours() * 60)
        if time > 0
          $scope.allTimes.push time if time not in $scope.allTimes
          $scope.timesWithPeopleFree[time] = [] if not $scope.timesWithPeopleFree[time]?
          
    $q.all(allPromises).then ->
      $scope.allTimes.sort (a,b) ->
        return a-b
      $scope.setLoaded $scope
      $scope.setPageLoaded()
