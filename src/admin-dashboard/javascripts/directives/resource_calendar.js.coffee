angular.module('BBAdminDashboard').directive 'bbResourceCalendar', (uiCalendarConfig,
    AdminCompanyService, AdminBookingService, AdminPersonService, $q, $sessionStorage, 
    ModalForm, BBModel, $window, $bbug) ->

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

    options = $scope.$eval $attrs.bbResourceCalendar or {}
    height = if options.header_height then $bbug(window).height() - options.header_height else 800

    $scope.options =
      calendar:
        editable: true
        # timezone: 'local'
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
            slotDuration: "00:05"
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
        eventAfterRender: (event, elements, view) ->
          if view.type == "timelineDay"
            element.style.height = "27px" for element in elements
          elements.draggable()
        select: (start, end, jsEvent, view, resource) ->
          view.calendar.unselect()
          # Do your stuff based on start time (moment object) & resource (staff member)

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
          
          
          
    $scope.pusherSubscribe = () =>
      if $scope.company? && Pusher? && !$scope.pusher?
        url = ""
        url = $scope.$root.bb.api_url if $scope.$root.bb.api_url?
        $scope.pusher = new Pusher 'c8d8cea659cc46060608',
          authEndpoint: "#{url}/api/v1/push/#{$scope.company.id}/pusher.json"
          auth:
            headers:
              # These should be put somewhere better - any suggestions?
              'App-Id' : 'f6b16c23'
              'App-Key' : 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
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
          console.log "Got here"

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
