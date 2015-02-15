angular.module('BBAdminServices').directive 'scheduleEdit', ($window, $document) ->

  timeRange = (start_time, div) ->
    start = start_time.clone()
    end = start_time.add(div, 'minutes')
    {
      label: start,
      range: [start.format('HHmm'),end.format('HHmm')].join('-')
    }

  controller = ($scope) ->

    $scope.weekdays = (moment().weekday(d) for d in [0..6])

    $scope.dates = (moment().add(x, 'days') for x in [0..6])

    $scope.hoursDone = false
    $scope.datesDone = false

    $scope.time_division = 60

    $scope.$watch 'time_division', (t) ->
      u = parseInt(t)
      m = moment({hour: 0, minute: 0})
      $scope.timeRanges = (timeRange(m, u) for mins in [0..(1440 - u)] by u)
      $scope.$evalAsync () ->
        $scope.renderModel()

    $scope.lastHour = () ->
      $scope.hoursDone = true

    $scope.lastDate = () ->
      $scope.datesDone = true if $scope.hoursDone



  link = (scope, element, attrs, ngModel) ->

    selectedIds = {}
    cls = "eng-selected-item"
    startCell = null
    dragging = false
    mode = "add"

    findSmallestDivision = () ->
      _.min(_.map(ngModel.$viewValue, (range, date) ->
        start = moment(range.split('-')[0], 'HHmm')
        end = moment(range.split('-')[1], 'HHmm')
        moment.duration(end.diff(start)).asMinutes()
      ))

    scope.renderModel = () ->
      ngModel.$render()

    ngModel.$render = () ->
      ids = _.flatten(_.map(ngModel.$viewValue, (rules, date) ->
        start = moment(rules.split('-')[0], 'HHmm')
        end = moment(rules.split('-')[1], 'HHmm')
        duration = moment.duration(end.diff(start)).asMinutes()
        _.map(_.range(0,duration,scope.time_division),
              () -> [date,timeRange(start,scope.time_division).range].join('|')
        )
      ))
      if scope.datesDone
        updateTableElements(ids)
      else
        scope.$watch 'datesDone', () ->
          updateTableElements(ids)

    updateTableElements = (ids) ->
      selectedIds[id] = true for id in ids
      for td in element.find('td') when _.indexOf(ids, td.id) > -1
        angular.element(td).addClass cls

    insertRange = (ranges, range) ->
      ranges.splice(_.sortedIndex(ranges, range), 0, range)
      ranges

    joinRanges = (ranges) ->
      _.reduce(ranges, (m, range) ->
        if range.slice(0, 4) == m.slice(m.length - 4, m.length)
          m.slice(0, m.length - 4) + range.slice(5, 9)
        else
          [m,range].join()
      , "")

    updateModel = (ids) ->
      ngModel.$setViewValue(_.reduce(ids, (memo, id) ->
        date = id.split('|')[0]
        range = id.split('|')[1]
        if memo[date]
          memo[date] = joinRanges(insertRange(memo[date].split(','), range))
        else
          memo[date] = range
        if memo[date][0] == ','
          memo[date] = memo[date].substr(1)
        memo
      ,{}))

    mouseUp = (el) ->
      dragging = false

    mouseDown = (el) ->
      dragging = true
      setStartCell el
      setEndCell el

    mouseEnter = (el) ->
      return unless dragging
      setEndCell el

    setStartCell = (el) ->
      startCell = el
      if el.hasClass(cls)
        mode = "subtract"
      else
        mode = "add"

    setEndCell = (el) ->
      cellsBetween(startCell, el).each ->
        el = angular.element(this)
        if mode is "add"
          el.addClass cls
          selectedIds[el.attr("id")] = true
        else
          el.removeClass cls
          delete selectedIds[el.attr("id")]
      updateModel(_.keys(selectedIds))

    cellsBetween = (start, end) ->
      coordsStart = getCoords(start)
      coordsEnd = getCoords(end)
      topLeft =
        column: $window.Math.min(coordsStart.column, coordsEnd.column)
        row: $window.Math.min(coordsStart.row, coordsEnd.row)

      bottomRight =
        column: $window.Math.max(coordsStart.column, coordsEnd.column)
        row: $window.Math.max(coordsStart.row, coordsEnd.row)

      element.find("table").parent().parent().children().filter(() ->
        angular.element(this).hasClass('active')
      ).find("td").filter ->
        el = angular.element(this)
        coords = getCoords(el)
        coords.column >= topLeft.column and coords.column <= bottomRight.column and
          coords.row >= topLeft.row and coords.row <= bottomRight.row

    getCoords = (cell) ->
      row = cell.parents("row")
      return {
        column: cell[0].cellIndex
        row: cell.parent()[0].rowIndex
      }

    wrap = (fn) ->
      ->
        el = angular.element(this)
        scope.$apply ->
          fn el

    element.delegate "td", "mousedown", wrap(mouseDown)
    element.delegate "td", "mouseenter", wrap(mouseEnter)
    $document.delegate "body", "mouseup", wrap(mouseUp)


  {
    controller: controller
    link: link
    templateUrl: 'schedule_edit_main.html'
    require: 'ngModel'
    scope:
      timeDivison: '='
  }


angular.module('schemaForm').config (schemaFormProvider,
    schemaFormDecoratorsProvider, sfPathProvider) ->

  schemaFormDecoratorsProvider.addMapping(
    'bootstrapDecorator'
    'schedule'
    'schedule_edit_form.html'
  )

  schemaFormDecoratorsProvider.createDirective(
    'schedule'
    'schedule_edit_form.html'
  )
