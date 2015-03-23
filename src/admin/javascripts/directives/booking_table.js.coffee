angular.module('BBAdmin').directive 'bookingTable', (AdminCompanyService,
    AdminBookingService, $modal, $log, ModalForm) ->

  controller = ($scope) ->

    $scope.fields = ['id', 'datetime']

    $scope.getBookings = () ->
      params =
        company: $scope.company
      AdminBookingService.query(params).then (bookings) ->
        $scope.bookings = bookings

    $scope.newBooking = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Booking'
        new_rel: 'new_booking'
        post_rel: 'bookings'
        success: (booking) ->
          $scope.bookings.push(booking)

    $scope.edit = (booking) ->
      ModalForm.edit
        model: booking
        title: 'Edit Booking'

  link = (scope, element, attrs) ->
    if scope.company
      scope.getBookings()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getBookings()

  {
    controller: controller
    link: link
    templateUrl: 'booking_table_main.html'
  }
