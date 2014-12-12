'use strict';

angular.module('BBAdmin.Controllers').controller 'CalendarCtrl',
($scope, AdminBookingService, $rootScope) ->

  ### event source that pulls from google.com
  $scope.eventSource = {
          url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
          className: 'gcal-event',           // an option!
          currentTimezone: 'America/Chicago' // an option!
  };
  ###

  $scope.eventsF = (start, end, tz, callback) ->
    console.log start, end, callback

    prms = {company_id: 21}
    prms.start_date = start.format("YYYY-MM-DD")
    prms.end_date = end.format("YYYY-MM-DD")

    bookings = AdminBookingService.query(prms)
    bookings.then (s) =>
      console.log s.items
      callback(s.items)
      s.addCallback (booking) =>
        $scope.myCalendar.fullCalendar('renderEvent',booking, true)


  $scope.dayClick = ( date, allDay, jsEvent, view ) ->
    $scope.$apply =>
      console.log(date, allDay, jsEvent, view)
      $scope.alertMessage = ('Day Clicked ' + date);

  # alert on Drop
   $scope.alertOnDrop = (event, revertFunc, jsEvent, ui, view) ->
    $scope.$apply =>
      $scope.popupTimeAction({action: "move", booking: event, newdate: event.start, onCancel: revertFunc})


  # alert on Resize
  $scope.alertOnResize = (event, revertFunc, jsEvent, ui, view ) ->
    $scope.$apply =>
      $scope.alertMessage = ('Event Resized ');

  # add and removes an event source of choice
  $scope.addRemoveEventSource = (sources,source) ->
    canAdd = 0;
    angular.forEach sources, (value, key) =>
      if sources[key] == source
        sources.splice(key,1)
        canAdd = 1
    if canAdd == 0
      sources.push(source);

  # add custom event
  $scope.addEvent = () ->
    y = ''
    m = ''
    $scope.events.push {
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame']
    }

  # remove event
  $scope.remove = (index) ->
    $scope.events.splice(index,1)

  # Change View
  $scope.changeView = (view) ->
    $scope.myCalendar.fullCalendar('changeView',view)

  $scope.eventClick = ( event, jsEvent, view) ->
    $scope.$apply =>
      $scope.selectBooking(event)

  $scope.selectTime = (start, end, allDay) ->
    $scope.$apply =>
      $scope.popupTimeAction({start_time: moment(start), end_time: moment(end), allDay: allDay})
      $scope.myCalendar.fullCalendar('unselect');

  # config object
  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'month agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      dayClick: $scope.dayClick,
      eventClick: $scope.eventClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
      selectable: true,
      selectHelper: true,
      select: $scope.selectTime,

    }
  }
  # event sources array*
  $scope.eventSources = [$scope.eventsF]
