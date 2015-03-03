angular.module('BBAdminServices').directive 'scheduleCal', (uiCalendarConfig, ScheduleRules) ->

  controller = ($scope) ->

    $scope.eventSources = [
      {
        events: (start, end, timezone, callback) ->
          callback($scope.getEvents())
      }
    ]

    $scope.options =
      calendar:
        editable: true
        selectable: true
        header:
          left: 'today,prev,next'
          center: 'title'
          right: 'month,agendaWeek,agendaDay'
        selectHelper: true
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
    scope: {}
  }


angular.module('schemaForm').config (schemaFormProvider,
    schemaFormDecoratorsProvider, sfPathProvider) ->

  schemaFormDecoratorsProvider.addMapping(
    'bootstrapDecorator'
    'scheduleCalendar'
    'schedule_cal_form.html'
  )

  schemaFormDecoratorsProvider.createDirective(
    'scheduleCalendar'
    'schedule_cal_form.html'
  )
