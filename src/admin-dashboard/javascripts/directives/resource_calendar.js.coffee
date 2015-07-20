angular.module('BBAdminDashboard').directive 'bbResourceCalendar', (uiCalendarConfig,
    AdminCompanyService, AdminBookingService, AdminPersonService, $q, ModalForm, BBModel) ->

  controller = ($scope) ->

    $scope.eventSources = [
      events: (start, end, timezone, callback) ->
        $scope.loading = true
        $scope.getCompanyPromise().then (company) ->
          params =
            company: company
            start_date: start.format('YYYY-MM-DD')
            end_date: end.format('YYYY-MM-DD')
          AdminBookingService.query(params).then (bookings) ->
            $scope.loading = false
            b.resourceId = b.person_id for b in bookings
            callback(bookings)
    ]

    $scope.options =
      calendar:
        editable: true
        # timezone: 'local'
        height: 800
        header:
          left: 'today,prev,next'
          center: 'title'
          right: 'timelineDay,agendaWeek,month'
        defaultView: 'timelineDay'
        views:
          timelineDay:
            slotDuration: "00:05"
            eventOverlap: false
            slotWidth: 50
        resourceLabelText: 'Staff'
        selectable: true
        resources: (callback) ->
          $scope.getPeople(callback)
        eventDrop: (event, delta, revertFunc) ->
          $scope.updateBooking(event, delta)
        eventClick: (event, jsEvent, view) ->
          $scope.editBooking(event)
        resourceRender: (resource, resourceTDs, dataTDs) ->
          for resourceTD in resourceTDs
            resourceTD.style.height = "44px" 
            resourceTD.style.verticalAlign = "middle" 
          dataTD.style.height = "44px" for dataTD in dataTDs
        eventAfterRender: (event, elements, view) ->
          if view.type == "timelineDay"
            element.style.height = "27px" for element in elements
          elements.draggable()
        select: (start, end, jsEvent, view, resource) ->
          view.calendar.unselect()
          # Do your stuff based on start time (moment object) & resource (person)

    $scope.getPeople = (callback) ->
      $scope.loading = true
      $scope.getCompanyPromise().then (company) ->
        params = {company: company}
        AdminPersonService.query(params).then (people) ->
          $scope.loading = false
          $scope.people = _.sortBy people, 'name'
          p.title = p.name for p in $scope.people
          uiCalendarConfig.calendars.resourceCalendar.fullCalendar('refetchEvents')
          callback($scope.people)

    $scope.updateBooking = (booking) ->
      booking.person_id = booking.resourceId
      booking.$put('self', {}, booking.getPostData()).then (response) =>
        new_booking = new BBModel.Admin.Booking(response)
        booking.person_id = new_booking.person_id
        booking.resourceId = booking.person_id
        booking.start = new_booking.start
        booking.end = new_booking.end
        uiCalendarConfig.calendars.resourceCalendar.fullCalendar('updateEvent', booking)


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
