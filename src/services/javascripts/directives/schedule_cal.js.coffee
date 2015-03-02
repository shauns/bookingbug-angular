angular.module('BBAdminServices').directive 'scheduleCal', (uiCalendarConfig) ->

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


  link = (scope, element, attrs, ngModel) ->

    scope.getEvents = () ->
      rangesToEvents(ngModel.$viewValue)

    diffInDays = (start, end) ->
      moment.duration(end.diff(start)).days()

    insertRange = (ranges, range) ->
      ranges.splice(_.sortedIndex(ranges, range), 0, range)
      ranges

    joinRanges = (ranges) ->
      _.reduce(ranges, (m, range) ->
        if m == ""
          range
        else if range.slice(0, 4) <= m.slice(m.length - 4, m.length)
          m.slice(0, m.length - 4) + range.slice(5, 9)
        else
          [m,range].join()
      , "")

    addNewRange = (ranges = "", range) ->
      joinRanges(insertRange(ranges.split(','), range))

    scope.addRange = (start, end) ->
      start_time = start.format('HHmm')
      end_time = end.format('HHmm')
      ngModel.$setViewValue(_.reduce(_.range(diffInDays(start, end) + 1), (ranges, i) ->
        date = moment(start).add(i, 'days').format('YYYY-MM-DD')
        if i == 0
          if diffInDays(start, end) > 1
            ranges[date] = addNewRange(ranges[date], [start_time,'0000'].join('-'))
          else
            ranges[date] = addNewRange(ranges[date], [start_time,end_time].join('-'))
        else if date == end.format('YYYY-MM-DD')
          ranges[date] = addNewRange(ranges[date], ['0000',end_time].join('-'))
        else
          ranges[date] = '0000-0000'
        ranges
      , ngModel.$viewValue))
      ngModel.$render()

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
