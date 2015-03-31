angular.module('BBAdminServices').directive 'scheduleCalendar', (uiCalendarConfig, ScheduleRules) ->

  controller = ($scope, $attrs) ->

    $scope.eventSources = [
      events: (start, end, timezone, callback) ->
        callback($scope.getEvents())
    ]

    options = $scope.$eval $attrs.scheduleCalendar or {}

    $scope.options =
      calendar:
        editable: true
        selectable: true
        defaultView: 'agendaWeek'
        header:
          left: 'today,prev,next'
          center: 'title'
          right: 'month,agendaWeek'
        selectHelper: true
        eventOverlap: false
        views:
          agendaWeek:
            allDaySlot: false
            slotEventOverlap: false
        select: (start, end, jsEvent, view) ->
          $scope.addRange(start, end)
        eventResizeStop: (event, jsEvent, ui, view) ->
          $scope.addRange(event.start, event.end)
        eventDrop: (event, delta, revertFunc, jsEvent, ui, view) ->
          if event.start.hasTime()
            orig =
              start: moment(event.start).subtract(delta)
              end: moment(event.end).subtract(delta)
            $scope.removeRange(orig.start, orig.end)
            $scope.addRange(event.start, event.end)

    $scope.options.calendar.views.agendaWeek.minTime = options.min_time if options.min_time
    $scope.options.calendar.views.agendaWeek.maxTime = options.max_time if options.max_time

    $scope.render = () ->
      $scope.$$childTail.scheduleCal.fullCalendar('render')


  link = (scope, element, attrs, ngModel) ->

    scheduleRules = () ->
      new ScheduleRules(ngModel.$viewValue)

    scope.getEvents = () ->
      scheduleRules().toEvents()

    scope.addRange = (start, end) ->
      ngModel.$setViewValue(scheduleRules().addRange(start, end))
      ngModel.$render()

    scope.removeRange = (start, end) ->
      ngModel.$setViewValue(scheduleRules().removeRange(start, end))
      ngModel.$render()

    ngModel.$render = () ->
      if scope.$$childTail
        scope.$$childTail.scheduleCal.fullCalendar('refetchEvents')
        scope.$$childTail.scheduleCal.fullCalendar('unselect')

  {
    controller: controller
    link: link
    templateUrl: 'schedule_cal_main.html'
    require: 'ngModel'
    scope:
      render: '=?'
  }
