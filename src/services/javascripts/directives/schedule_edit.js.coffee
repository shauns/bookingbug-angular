angular.module('BBAdminServices').directive 'scheduleEdit', ($window, $document) ->

  hourRange = (start_hour) ->
    start = start_hour* 100
    end = start_hour*100 + 100
    "#{sprintf('%04s', start)}-#{sprintf('%04s', end)}"

  controller = ($scope) ->

    # start_date = moment()
    # $scope.dates = (start_date.add(x, 'days').format('YYYY-MM-DD') for x in [0..6])
    $scope.dates = [0..6]
    $scope.hours = (hourRange(x) for x in [0..23])

    $scope.hoursDone = false
    $scope.datesDone = false


    $scope.lastHour = () ->
      $scope.hoursDone = true

    $scope.lastDate = () ->
      $scope.datesDone = true if $scope.hoursDone


  link = (scope, element, attrs, ngModel) ->

    selectedIds = []
    cls = "eng-selected-item"
    startCell = null
    dragging = false

    ngModel.$render = () ->
      ids = _.flatten(_.map(ngModel.$viewValue, (hours, date) ->
        _.map(_.range(parseInt(hours.split('-')[0])/100,
                      parseInt(hours.split('-')[1])/100),
              (hour) -> "#{date}|#{hourRange(hour)}")
      ))
      if scope.datesDone
        updateTableElements(ids)
      else
        scope.$watch 'datesDone', () ->
          updateTableElements(ids)

    updateTableElements = (ids) ->
      for td in element.find('td') when _.indexOf(ids, td.id) > -1
        angular.element(td).addClass cls

    updateModel = (ids) ->
      ngModel.$setViewValue(_.reduce(ids, (memo, id) ->
        date = id.split('|')[0]
        hours = id.split('|')[1]
        if memo[date]
          memo[date] = "#{memo[date].split('-')[0]}-#{hours.split('-')[1]}"
        else
          memo[date] = hours
        memo
      , {}))

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

    setEndCell = (el) ->
      selectedIds = []
      element.find("td").removeClass cls
      cellsBetween(startCell, el).each ->
        el = angular.element(this)
        el.addClass cls
        selectedIds.push el.attr("id")
        updateModel(selectedIds)

    cellsBetween = (start, end) ->
      coordsStart = getCoords(start)
      coordsEnd = getCoords(end)
      topLeft =
        column: $window.Math.min(coordsStart.column, coordsEnd.column)
        row: $window.Math.min(coordsStart.row, coordsEnd.row)

      bottomRight =
        column: $window.Math.max(coordsStart.column, coordsEnd.column)
        row: $window.Math.max(coordsStart.row, coordsEnd.row)

      element.find("td").filter ->
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
    scope: {}
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
