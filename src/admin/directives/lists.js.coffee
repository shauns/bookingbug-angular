'use strict';


angular.module('BBAdmin.Directives').directive 'bbPeopleList', ($rootScope) ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : ($scope,  $rootScope, PersonService, $q, BBModel, PersonModel) ->
    $rootScope.connection_started.then ->
      $scope.bb.company.getPeoplePromise().then (people) ->
        $scope.people = people
        for person in people
          person.show = true
    $scope.show_all_people = ->
      for x in $scope.people
        x.show = true
    $scope.hide_all_people = ->
      for x in $scope.people
        x.show = false
  link : (scope, element, attrs) ->
    return




angular.module('BBAdmin.Directives').directive 'bbBookingList', ->
  restrict: 'AE'
  replace: true
  scope: {
    bookings: '='
    cancelled: '='
    params: '='
  }

  templateUrl: (tElm, tAttrs) ->
    tAttrs.template

  controller: ($scope, $filter) ->
    $scope.title = $scope.params.title
    status = $scope.params.status
    
    $scope.$watch ->
      $scope.bookings
    , ->
      bookings = $scope.bookings
      cancelled = $scope.cancelled
      cancelled ?= false
      
      if (bookings?)
        bookings = $filter('filter') bookings, (booking) ->
          ret = (booking.is_cancelled == cancelled)
          if (status?)
            ret &= booking.hasStatus(status)
          else
            ret &= (!booking.multi_status? || Object.keys(booking.multi_status).length == 0)
          ret &= (booking.status == 4)
          return ret
        
        $scope.relevantBookings = $filter('orderBy')(bookings, 'datetime')
      
      $scope.relevantBookings ?= []
