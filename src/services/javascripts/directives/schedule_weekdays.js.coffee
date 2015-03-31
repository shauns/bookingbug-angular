angular.module('BBAdminServices').directive 'scheduleWeekdays', (uiCalendarConfig, ScheduleRules) ->

  controller = ($scope, $attrs) ->

    $scope.eventSources = [
      events: (start, end, timezone, callback) ->
        callback($scope.getEvents())
    ]

    options = $scope.$eval $attrs.scheduleWeekdays or {}

    $scope.options =
      calendar:
        editable: true
        selectable: true
        defaultView: 'agendaWeek'
        header:
          left: ''
          center: 'title'
          right: ''
        selectHelper: true
        eventOverlap: false
        views:
          agendaWeek:
            titleFormat: '[]'
            allDaySlot: false
            columnFormat: 'ddd'
            slotEventOverlap: false
        select: (start, end, jsEvent, view) ->
          $scope.addRange(start, end)

    $scope.options.calendar.views.agendaWeek.minTime = options.min_time if options.min_time
    $scope.options.calendar.views.agendaWeek.maxTime = options.max_time if options.max_time

    $scope.render = () ->
      $scope.$$childTail.scheduleCal.fullCalendar('render')


  link = (scope, element, attrs, ngModel) ->

    scheduleRules = () ->
      new ScheduleRules(ngModel.$viewValue)

    scope.getEvents = () ->
      scheduleRules().toWeekdayEvents()

    scope.addRange = (start, end) ->
      ngModel.$setViewValue(scheduleRules().addWeekdayRange(start, end))
      ngModel.$render()

    scope.removeRange = (start, end) ->
      ngModel.$setViewValue(scheduleRules().removeWeekdayRange(start, end))
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
