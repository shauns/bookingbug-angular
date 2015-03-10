angular.module('BBMember').directive 'memberBookings', ($modal, $log, $rootScope,
    MemberLoginService, MemberBookingService, $compile, $templateCache, $q) ->

  controller = ($scope, $modal) ->

    $scope.loading = true

    $scope.getUpcomingBookings = () ->
      params =
        start_date: moment().format('YYYY-MM-DD')
      getBookings(params).then (bookings) ->
        $scope.upcoming_bookings = bookings

    $scope.getPastBookings = (num, type) ->
      date = moment().subtract(num, type)
      params =
        start_date: date.format('YYYY-MM-DD')
        end_date: moment().format('YYYY-MM-DD')
      getBookings(params).then (bookings) ->
        $scope.past_bookings = bookings

    $scope.flushBookings = () ->
      params =
        start_date: moment().format('YYYY-MM-DD')
      MemberBookingService.flush($scope.member, params)

    $scope.cancel = (booking) ->
      modalInstance = $modal.open
        templateUrl: "member_booking_delete_modal.html"
        windowClass: "bbug"
        controller: ($scope, $rootScope, $modalInstance, booking) ->
          $scope.controller = "ModalDelete"
          $scope.booking = booking

          $scope.confirm_delete = () ->
            $modalInstance.close(booking)

          $scope.cancel = ->
            $modalInstance.dismiss "cancel"
        resolve:
          booking: ->
            booking
      modalInstance.result.then (booking) ->
        cancelBooking(booking)

    getBookings = (params) ->
      $scope.loading = true
      defer = $q.defer()
      MemberBookingService.query($scope.member, params).then (bookings) ->
        $scope.loading = false
        defer.resolve(bookings)
      , (err) ->
        $log.error err.data
        $scope.loading = false
      defer.promise

    cancelBooking = (booking) ->
      MemberBookingService.cancel($scope.member, booking).then () ->
        if $scope.bookings
          $scope.bookings = $scope.bookings.filter (b) -> b.id != booking.id
        if $scope.removeBooking
          $scope.removeBooking(booking)


  link = (scope, element, attrs) ->
    $rootScope.bb ||= {}
    $rootScope.bb.api_url ||= scope.apiUrl
    $rootScope.bb.api_url ||= "http://www.bookingbug.com"

    getBookings = () ->
      scope.getUpcomingBookings()
      scope.getPastBookings(1, 'years')

    scope.$on 'updateBookings', () ->
      scope.flushBookings()
      getBookings()

    getBookings()

  {
    link: link
    controller: controller
    templateUrl: 'member_bookings_tabs.html'
    scope:
      apiUrl: '@'
      member: '='
  }
