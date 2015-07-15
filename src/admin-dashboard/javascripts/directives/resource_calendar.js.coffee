angular.module('BBAdminDashboard').directive 'bbResourceCalendar', (uiCalendarConfig,
    AdminCompanyService, AdminBookingService, AdminPersonService, $q, ModalForm, BBModel) ->

  controller = ($scope) ->

    $scope.eventSources = [
      events: (start, end, timezone, callback) ->
        $scope.getCompanyPromise().then (company) ->
          params =
            company: company
            start_date: start.format('YYYY-MM-DD')
            end_date: end.format('YYYY-MM-DD')
          AdminBookingService.query(params).then (bookings) ->
            b.resourceId = b.person_id for b in bookings
            console.log bookings
            callback(bookings)
    ]

    $scope.options =
      calendar:
        editable: true
        # timezone: 'local'
        header:
          left: 'today,prev,next'
          center: 'title'
          right: 'timelineDay,agendaWeek,month'
        defaultView: 'timelineDay'
        views:
          timelineDay:
            slotDuration: "00:05"
        resourceLabelText: 'Staff'
        resources: (callback) ->
          $scope.getPeople(callback)
        eventDrop: (event, delta, revertFunc) ->
          $scope.updateBooking(event, delta)
        eventClick: (event, jsEvent, view) ->
          $scope.editBooking(event)

    $scope.getPeople = (callback) ->
      $scope.getCompanyPromise().then (company) ->
        params = {company: company}
        AdminPersonService.query(params).then (people) ->
          $scope.people = people
          resources = for p in people
            id: p.id
            title: p.name
          uiCalendarConfig.calendars.resourceCalendar.fullCalendar('refetchEvents')
          callback(resources)

    $scope.updateBooking = (booking, delta) ->
      booking.person_id = booking.resourceId
      booking.start = booking.start.add(delta)
      booking.end = booking.end.add(delta)
      booking = booking.$update()
      booking.resourceId = booking.person_id

    $scope.editBooking = (booking) ->
      ModalForm.edit
        model: booking
        title: 'Edit Booking'
        success: (response) =>
          new_booking = new BBModel.Admin.Booking(response)
          booking.person_id = new_booking.person_id
          booking.resourceId = booking.person_id
          booking.start = new_booking.start
          booking.end = new_booking.end
          console.log 'updated booking ', booking
          uiCalendarConfig.calendars.resourceCalendar.fullCalendar('updateEvent', booking)

  link = (scope, element, attrs) ->

    scope.getCompanyPromise = () ->
      defer = $q.defer()
      if scope.company
        defer.resolve(scope.company)
      else
        AdminCompanyService.query(attrs).then (company) ->
          scope.company = company
          defer.resolve(scope.company)
      defer.promise

  {
    controller: controller
    link: link
    templateUrl: 'resource_calendar_main.html'
  }
