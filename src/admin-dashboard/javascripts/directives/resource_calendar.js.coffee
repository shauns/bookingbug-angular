angular.module('BBAdminDashboard').directive 'bbResourceCalendar', (
    uiCalendarConfig, AdminCompanyService, AdminBookingService,
    AdminPersonService, $q, $sessionStorage, ModalForm, BBModel,
    AdminBookingPopup, $window, $bbug, ColorPalette, AppConfig) ->

  controller = ($scope, $attrs) ->

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


    $scope.options = $scope.$eval $attrs.bbResourceCalendar
    $scope.options ||= {}

    height = if $scope.options.header_height
      $bbug($window).height() - $scope.options.header_height
    else
      800

    $scope.uiCalOptions =
      calendar:
        eventStartEditable: true
        eventDurationEditable: false
        height: height
        header:
          left: 'today,prev,next'
          center: 'title'
          right: 'timelineDay,agendaWeek,month'
        defaultView: 'timelineDay'
        views:
          month:
            eventLimit: 5
          timelineDay:
            slotDuration: $scope.options.slotDuration || "00:05"
            eventOverlap: false
            slotWidth: 44
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
        eventRender: (event, element) ->
          person = _.findWhere($scope.people, {id: event.person_id})
          element.css('background-color', person.color)
          element.css('color', person.textColor)
          element.css('border-color', person.textColor)
        eventAfterRender: (event, elements, view) ->
          if view.type == "timelineDay"
            element.style.height = "27px" for element in elements
          if 'startEditable' in event && 'ontouchstart' in document.documentElemnt
            elements.draggable()
        select: (start, end, jsEvent, view, resource) ->
          view.calendar.unselect()
          AdminBookingPopup.open
            date: start.format('YYYY-MM-DD')
            time: start.format('HH:mm')
            person: resource.id if resource
        # eventResize: (event, delta, revertFunc, jsEvent, ui, view) ->
        #   event.duration = event.end.diff(event.start, 'minutes')
        #   $scope.updateBooking(event)

    $scope.getPeople = (callback) ->
      $scope.loading = true
      $scope.getCompanyPromise().then (company) ->
        params = {company: company}
        AdminPersonService.query(params).then (people) ->
          $scope.loading = false
          $scope.people = _.sortBy people, 'name'
          p.title = p.name for p in $scope.people
          ColorPalette.setColors(people)
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

    $scope.pusherSubscribe = () =>
      if $scope.company? && Pusher? && !$scope.pusher?
        $scope.pusher = new Pusher 'c8d8cea659cc46060608',
          authEndpoint: $scope.company.$link('pusher').href
          auth:
            headers:
              'App-Id' : AppConfig.appId
              'App-Key' : AppConfig.appKey
              'Auth-Token' : $sessionStorage.getItem('auth_token')
        channelName = "private-c#{$scope.company.id}-w#{$scope.company.numeric_widget_id}"
        if !$scope.pusher.channel(channelName)?
          $scope.pusher_channel = $scope.pusher.subscribe(channelName)
          pusherEvent = (res) =>
            if res.id?
              setTimeout (->
                prms =
                  company: $scope.company
                  id: res.id
                AdminBookingService.getBooking(prms).then (booking) ->
                  return
              ), 2000
          $scope.pusher_channel.bind 'booking', pusherEvent
          $scope.pusher_channel.bind 'cancellation', pusherEvent
          $scope.pusher_channel.bind 'updating', pusherEvent


  link = (scope, element, attrs) ->

    scope.getCompanyPromise = () ->
      defer = $q.defer()
      if scope.company
        defer.resolve(scope.company)
      else
        AdminCompanyService.query(attrs).then (company) ->
          scope.company = company
          scope.pusherSubscribe()
          defer.resolve(scope.company)
      defer.promise

  {
    controller: controller
    link: link
    templateUrl: 'resource_calendar_main.html'
  }
