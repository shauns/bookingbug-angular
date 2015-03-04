angular.module('BBAdminServices').directive 'scheduleWeekdays', (uiCalendarConfig, ScheduleRules) ->

  controller = ($scope) ->

    $scope.eventSources = [
      events: (start, end, timezone, callback) ->
        callback($scope.getEvents())
    ]

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
        views:
          agendaWeek:
            titleFormat: '[Weekdays]'
            allDaySlot: false
            columnFormat: 'ddd'
        select: (start, end, jsEvent, view) ->
          $scope.addRange(start, end)

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
