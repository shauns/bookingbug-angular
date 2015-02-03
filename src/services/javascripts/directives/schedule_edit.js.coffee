angular.module('BBAdminServices').directive 'scheduleEdit', ($window, $document) ->

  # TODO
  # time slots wont nessecarily be an hour, could be 15 mins
  hourRange = (start_hour) ->
    start = start_hour* 100
    end = start_hour*100 + 100
    "#{sprintf('%04s', start)}-#{sprintf('%04s', end)}"

  controller = ($scope) ->

    $scope.dates = [0..6]
    $scope.hours = (hourRange(x) for x in [0..23])

    $scope.hoursDone = false
    $scope.datesDone = false

    # TODO
    # using dates and hours specified, create array of slots indexed by hour (rows) and date (cols)
    # eg. $scope.slots['13:00']['2015-10-01']

    # options = {start_date: '2015-02-02', end_date: '2015-02-02', start_time: '0800', end_time: '2200', duration: '30'}

    # if (options.start_date and angular.isNumber(options.start_date)) and (options.end_date and angular.isNumber(options.end_date))
    #   start_date = options.start_date
    #   end_date   = options.end_date
    # else
    #   start_date = moment(options.start_date)
    #   end_date   = moment(options.end_date)


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

    # render existing schedule
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

    # highlight selected cells
    updateTableElements = (ids) ->
      for td in element.find('td') when _.indexOf(ids, td.id) > -1
        angular.element(td).addClass cls

    # update the rules json string
    updateModel = (ids) ->
      #1 sort cells then update range
      #1 ids = sortSelectedCells(ids)
      ngModel.$setViewValue(_.reduce(ids, (memo, id) ->
        date = id.split('|')[0]
        hours = id.split('|')[1]
        if memo[date]
          #1 memo[date] = "#{memo[date].split('-')[0]}-#{hours.split('-')[1]}"

          #2 check each new selected cell and adjust range as needed
          memo_start  = parseInt(memo[date].slice(0,2))
          memo_end    = parseInt(memo[date].slice(5,7))
          hours_start = parseInt(hours.slice(0,2))
          hours_end   = parseInt(hours.slice(5,7))

          if hours_start < memo_start then start = hours.split('-')[0] else start = memo[date].split('-')[0]
          if hours_end > memo_end then end = hours.split('-')[1] else end = memo[date].split('-')[1]
          memo[date] = "#{start}-#{end}"
        else
          memo[date] = hours
        memo
      , {}))


    sortSelectedCells = (ids) ->
      ids = _.toArray(ids) 
      ids.sort (id1,id2) ->
        a = {}
        b = {}
        a.date  = parseInt(id1.split('|')[0])
        a.hours = parseInt(id1.split('|')[1].slice(0,2))
        b.date  = parseInt(id2.split('|')[0])
        b.hours = parseInt(id2.split('|')[1].slice(0,2))
        if a.date is b.date
          return a.hours - b.hours
        return a.date - b.date
      return ids


    mouseUp = (el) ->
      dragging = false
      updateModel(selectedIds)

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
          selectedIds[el.attr("id")] = el.attr("id") 
        else
          el.removeClass cls
          delete selectedIds[el.attr("id")]

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
