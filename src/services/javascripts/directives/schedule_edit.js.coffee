angular.module('BBAdminServices').directive 'scheduleEdit', ($window, $document) ->

  # TODO
  # time slots wont nessecarily be an hour, could be 15 mins!
  hourRange = (start_hour) ->
    start = start_hour* 100
    end = start_hour*100 + 100
    "#{sprintf('%04s', start)}-#{sprintf('%04s', end)}"

  controller = ($scope) ->

    # TODO
    # init directive with date range, time range and duration of time slots

    # start_date = moment()
    # $scope.dates = (start_date.add(x, 'days').format('YYYY-MM-DD') for x in [0..6])
    # TODO days represented and hour should be configurable
    $scope.dates = [0..6]
    $scope.hours = (hourRange(x) for x in [0..23])

    $scope.hoursDone = false
    $scope.datesDone = false

    # TODO
    # using dates and hours specified, create array of slots indexed by hour (rows) and date (cols)
    # eg. $scope.slots['2015-10-01']['13:00']
    #


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
      debugger
      # _.sortBy(ids, (id) ->
      #   date = id.split('|')[0]
      #   hours = id.split('|')[1]
      # )
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
      # TODO need to interate through cells to determine selected state, toggle selected cells
      # only on mouse up shpould the JSON string be built
      # inspect selected cells with that ar
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

    # TODO don't change the selected state of a cell that's already been processed - start cell
    # Remember that end cell is called repeaty as the mouse enters new cells
    setEndCell = (el) ->
      #selectedIds = [] #clear this on mouse down
      #interactedWith = []
      #element.find("td").removeClass cls
      cellsBetween(startCell, el).each ->
        #return if interactedWith.indexOf(el.attr("id")) != -1
        el = angular.element(this)
        # TODO use id of cell to find slot in array and then set the status of it, should use ng-class to apply selected class
        # if el.hasClass(cls)
        #   el.removeClass cls
        # else
        if mode is "add"
          el.addClass cls
          selectedIds[el.attr("id")] = el.attr("id") 
        else
          el.removeClass cls
          delete selectedIds[el.attr("id")]
        #interactedWith.push el.attr("id")
        #updateModel(selectedIds)
        console.log 'selectedIds', selectedIds




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
