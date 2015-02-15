angular.module('BBAdminServices').directive 'scheduleCal', (uiCalendarConfig) ->

  controller = ($scope) ->

    $scope.options =
      calendar:
        editable: true
        selectable: true
        header:
          left: 'today,prev,next'
          center: 'title'
          right: 'month,agendaWeek,agendaDay'
        dayClick: (day) ->
          $scope.$$childTail.scheduleCal.fullCalendar('changeView', 'agendaDay')
          $scope.$$childTail.scheduleCal.fullCalendar('gotoDate', day)
        selectHelper: true
        select: (start, end, jsEvent, view) ->
          $scope.addRange(start, end)


  link = (scope, element, attrs, ngModel) ->

    diffInDays = (start, end) ->
      moment.duration(end.diff(start)).days()

    scope.addRange = (start, end) ->
      console.log 'add range'
      ranges = ngModel.$viewValue
      _.each(_.range(diffInDays(start, end) + 1), (i) ->
        date = moment(start).add(i, 'days')
        if i == 0
          if diffInDays(start, end) > 1
            ranges[date.format('YYYY-MM-DD')] =
              [start.format('HHmm'),'0000'].join('-')
          else
            ranges[date.format('YYYY-MM-DD')] =
              [start.format('HHmm'),end.format('HHmm')].join('-')
        else if date.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')
          ranges[date.format('YYYY-MM-DD')] =
            ['0000',end.format('HHmm')].join('-')
        else
          ranges[date.format('YYYY-MM-DD')] = '0000-0000'
      )
      ngModel.$setViewValue(ranges)
      console.log ngModel.$viewValue

    filterModelByDates = (model) ->
      _.pick model, (value, key) ->
        key.match(/^\d{4}-\d{2}-\d{2}$/)

    formatTime = (time) ->
      [time[0..1],time[2..3]].join(':')

    rangesToEvents = (model) ->
      _.reduce(filterModelByDates(model), (memo, ranges, date) ->
        memo = memo.concat(_.map(ranges.split(','), (range) ->
          start: date + "T" + formatTime(range.split('-')[0])
          end: date + "T" + formatTime(range.split('-')[1])
        ))
        memo
      ,[])

    ngModel.$render = () ->
      scope.eventSources =
        events: rangesToEvents(ngModel.$viewValue)

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
