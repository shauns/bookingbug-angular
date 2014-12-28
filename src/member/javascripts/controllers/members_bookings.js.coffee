angular.module('BB.Controllers').controller 'MembersBookings', ($scope, $rootScope, $location,
    $filter, $q, $timeout, $modal, MemberBookingService, LoginService, BBModel) ->

  $scope.init = (options) =>
    @type = options.type
    @limit = options.limit

  $scope.$watch "members", (new_value, old_value) =>
    getBookings() if $scope.members

  $scope.$watch "member", (new_value, old_value) =>
    getBookings() if $scope.member

  $scope.$on "updateBookings", () =>
    flushBookings()
    getBookings()

  getBookings = () =>
    switch @type
      when 'upcoming' then $scope.upcoming()
      when 'historical' then $scope.historical('years', -1)

  flushBookings = () =>
    switch @type
      when 'upcoming'
        params =
          start_date: moment().format('YYYY-MM-DD')
        member = $scope.member
        MemberBookingService.flush(member, params)

  $scope.filter_bookings = (booking) -> booking.deleted == true

  doCancel = (member, booking) ->
    MemberBookingService.cancel(member, booking).then () ->
      if $scope.bookings
        $scope.bookings = $scope.bookings.filter (b) -> b.id != booking.id
      if $scope.removeBooking
        $scope.removeBooking(booking)

    , (err) ->
      console.log 'cancel error'

  $scope.cancel = (booking) ->
    modalInstance = $modal.open
      templateUrl: "deleteModal.html"
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
      console.log "close booking", booking, $scope.member,$scope.members 
      if $scope.member
        doCancel($scope.member, booking)
      if $scope.client
        doCancel($scope.client, booking)
      else if $scope.members
        booking.$get('member').then (member) ->
          doCancel(member, booking)
    
  $scope.upcoming = () =>
    $scope.notLoaded $scope
    params =
      start_date: moment().format('YYYY-MM-DD')
    params.per_page = @limit if @limit
    if $scope.members
      members = $scope.members
    else if $scope.member
      members = [$scope.member]
    promises =
      for member in members
        MemberBookingService.query(member, params)
    $q.all(promises).then (bookings) ->
      $scope.setLoaded $scope
      $scope.bookings = [].concat.apply([], bookings)
    , (err) ->
      $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.historical = (type, num) =>
    $scope.notLoaded $scope
    date = moment().add(num, type)
    params =
      start_date: date.format('YYYY-MM-DD')
      end_date: moment().format('YYYY-MM-DD')
    params.per_page = @limit if @limit
    if $scope.members
      members = $scope.members
    else if $scope.member
      members = [$scope.member]
    promises =
      for member in members
        MemberBookingService.query(member, params)
    $q.all(promises).then (bookings) ->
      $scope.setLoaded $scope
      $scope.bookings = [].concat.apply([], bookings)
    , (err) ->
      $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.move = (booking, route, options = {}) ->
    booking.getMemberPromise().then (member) ->
      $scope.setClient(member)
      $scope.notLoaded $scope
      $scope.initWidget({company_id: booking.company_id, no_route: true})
      $scope.clearPage()
      $timeout () =>
        $scope.bb.moving_booking = booking
        new_item = new BBModel.BasketItem(booking, $scope.bb)
        new_item.setSrcBooking(booking)
        new_item.ready = false
        if booking.$has('resource') && options.use_resource
          booking.$get('resource').then (resource) =>
            new_item.setResource(new BBModel.Resource(resource))
            if booking.$has('service')
              booking.$get('service').then (service) =>
                new_item.setService(new BBModel.Service(service))
                $scope.setBasketItem(new_item)
                $scope.setLoaded $scope
                $scope.decideNextPage(route)
              , (err) ->
                $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
            else
              $scope.setBasketItem(new_item)
              $scope.setLoaded $scope
              $scope.decideNextPage(route)
        else
          if booking.$has('service')
            booking.$get('service').then (service) =>
              new_item.setService(new BBModel.Service(service))
              $scope.setBasketItem(new_item)
              $scope.setLoaded $scope
              $scope.decideNextPage(route)
            , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
          else
            $scope.setBasketItem(new_item)
            $scope.setLoaded $scope
            $scope.decideNextPage(route)

  $scope.isMovable = (booking) ->
    if booking.min_cancellation_time
      return moment().isBefore(booking.min_cancellation_time)
    booking.datetime.isAfter(moment())
