'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletCheckin', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletCheckin'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletCheckin', ($scope,  $rootScope, $q, $filter, AdminTimeService, AdminBookingService, AdminSlotService, $timeout) ->
  
  $scope.sorter = "unixTime"
  
  $scope.doSort = (sorter) =>
    if sorter == $scope.sorter && $scope.sortAscending?
      $scope.sortAscending = !$scope.sortAscending
    else
      $scope.sortAscending = true
    
    $scope.sorter = sorter
    $scope.bookings = $filter('orderBy')($scope.bookings, (item) => 
      $scope.bmap[item][sorter]
    , !$scope.sortAscending)
    
    return false

  $rootScope.connection_started.then ->
    $scope.loadAppointments()

  $scope.loadAppointments = () =>

    $scope.notLoaded $scope
    prms = { company_id: $scope.bb.company_id, date: moment().format('YYYY-MM-DD') }
    prms.url = $scope.bb.api_url

    AdminBookingService.query(prms).then (res) =>
      $scope.booking_collection = res
      $scope.bookings = []
      $scope.bmap = {}      
      for item in res.items
        item.unixTime = item.datetime.unix()
        if item.status != 3 # not blocked
          $scope.bookings.push(item.id)
          $scope.bmap[item.id] = item
      $scope.doSort($scope.sorter)
      $scope.setLoaded $scope
      $scope.setPageLoaded()
      # update the items if they've changed
      $scope.booking_collection.addCallback $scope, (booking, status) =>
        $scope.bookings = []
        $scope.bmap = {}      
        for item in $scope.booking_collection.items
          item.unixTime = item.datetime.unix()
          if item.status != 3 # not blocked
            $scope.bookings.push(item.id)
            $scope.bmap[item.id] = item
        $scope.doSort($scope.sorter)


  $scope.setStatus = (booking, status) =>
    AdminBookingService.addStatusToBooking({company_id: $scope.bb.company_id, notify: false}, booking, status).then (res) =>
      $scope.booking_collection.checkItem(res)


  @checker = () =>
    $timeout () =>
      # do nothing - this will cause an apply anyway
      @checker()
    , 1000

  @checker()