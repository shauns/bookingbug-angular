'use strict'

angular.module('BB.Directives').directive 'bbEvents', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'EventList'

  link : (scope, element, attrs) ->
    scope.summary = attrs.summary
    return


angular.module('BB.Controllers').controller 'EventList', ($scope,  $rootScope, EventService, $q, PageControllerService, FormDataStoreService) ->
  $scope.controller = "public.controllers.EventList"
  $scope.notLoaded $scope
  angular.extend(this, new PageControllerService($scope, $q))
  $scope.pick = {}
  $scope.start_date = moment()
  $scope.end_date = moment().add(1, 'year')

  FormDataStoreService.init 'EventList', $scope, [
    'selected_date',
    'event_group_id'
  ]

  $rootScope.connection_started.then ->
    if $scope.bb.company

      if $scope.summary then $scope.getSummary() else $scope.init()

  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
  
  $scope.fully_booked = false


  $scope.getSummary = () ->
    current_event = $scope.current_item.event
    if $scope.current_item.event
      delete $scope.current_item.event
      delete $scope.current_item.event_chain

    $scope.notLoaded $scope
    comp = $scope.bb.company 
    params = {item: $scope.bb.current_item, start_date:$scope.start_date.format("YYYY-MM-DD"), end_date:$scope.end_date.format("YYYY-MM-DD")}

    EventService.summary(comp, params).then (items) ->
      item_dates = []
      for item in items
        d = moment(item)
        item_dates.push({
          date:d, 
          idate:  parseInt(d.format("YYYYDDDD")), 
          count:1, 
          spaces:1,
          today: moment().isSame(d, 'day')
        })

      $scope.item_dates = item_dates.sort (a,b) -> (a.idate - b.idate) 

      # clear the selected date if the event group has changed
      if $scope.current_item? && $scope.current_item.event_group?
        if $scope.current_item.event_group.id != $scope.event_group_id
          $scope.showDate($scope.item_dates[0].date)
        $scope.event_group_id = $scope.current_item.event_group.id
      if ($scope.selected_date && ($scope.selected_date.isAfter($scope.item_dates[0].date) || $scope.selected_date.isSame($scope.item_dates[0].date)) && ($scope.selected_date.isBefore($scope.item_dates[$scope.item_dates.length-1].date) || $scope.selected_date.isSame($scope.item_dates[$scope.item_dates.length-1].date)))
        $scope.showDate($scope.selected_date)
      else
        $scope.showDate($scope.item_dates[0].date)

      $scope.setLoaded $scope


    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
 

  $scope.init = (comp) ->
    current_event = $scope.current_item.event

    if $scope.current_item.event
      delete $scope.current_item.event
      delete $scope.current_item.event_chain

    $scope.notLoaded $scope
    comp ||= $scope.bb.company 
    params = {item: $scope.bb.current_item, start_date:$scope.start_date.format("YYYY-MM-DD"), end_date:$scope.end_date.format("YYYY-MM-DD")}
    EventService.query(comp, params).then (items) ->
      $scope.items = items

      # check if the current item already has the same event selected
      for item in $scope.items
        item.prepEvent()
        if current_event and current_event.self == item.self
          item.select() 
          $scope.event = item

      if !$scope.summary
        item_dates = {}
        if items.length > 0
          for item in items
            item.getDuration()
            idate = parseInt(item.date.format("YYYYDDDD"))
            item.idate = idate
            if !item_dates[idate]
              item_dates[idate] = {date:item.date, idate: idate, count:0, spaces:0}
            item_dates[idate].count +=1
            item_dates[idate].spaces += item.num_spaces
          $scope.item_dates = []
          for x,y of item_dates
            $scope.item_dates.push(y)
          $scope.item_dates = $scope.item_dates.sort (a,b) -> (a.idate - b.idate)
        else
          idate =  parseInt($scope.start_date.format("YYYYDDDD"))
          $scope.item_dates = [{date:$scope.start_date, idate: idate, count:0, spaces:0  }]

        # clear the selected date if the event group has changed
        if $scope.current_item? && $scope.current_item.event_group?
          if $scope.current_item.event_group.id != $scope.event_group_id
            $scope.showDate($scope.item_dates[0].date)
          $scope.event_group_id = $scope.current_item.event_group.id
        if ($scope.selected_date && ($scope.selected_date.isAfter($scope.item_dates[0].date) || $scope.selected_date.isSame($scope.item_dates[0].date)) && ($scope.selected_date.isBefore($scope.item_dates[$scope.item_dates.length-1].date) || $scope.selected_date.isSame($scope.item_dates[$scope.item_dates.length-1].date)))
          $scope.showDate($scope.selected_date)
        else
          $scope.showDate($scope.item_dates[0].date)

      full_events = []
      for item in items
        item.getDuration()
        if item.num_spaces == item.spaces_booked
          full_events.push(item)
        else
          item.qty = 1
      if (full_events.length) == items.length
        $scope.fully_booked = true

      $scope.setLoaded $scope
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  # accepts moment date object
  $scope.showDate = (date) ->
    if date

      # unselect the event if it's not on the day being selected
      if $scope.event and !$scope.selected_date.isSame(date, 'day')
        delete $scope.event

      $scope.selected_date = date

      if $scope.summary
        $scope.start_date = moment(date)
        $scope.end_date = moment(date)
        $scope.init()
      else
        $scope.items = []

    
  $scope.$watch 'pick.date', (newValue, oldValue) =>
    if newValue
      $scope.start_date = moment(newValue)
      $scope.end_date = moment(newValue)
      $scope.init()


  $scope.selectItem = (item, route) =>
    return false unless item.hasSpace()
    $scope.notLoaded $scope
    if $scope.$parent.$has_page_control
      $scope.event.unselect() if $scope.event
      $scope.event = item
      $scope.event.select()
      $scope.setLoaded $scope
      return false
    else
      $scope.bb.current_item.setEvent(item)
      $scope.bb.current_item.ready = false
      $q.all($scope.bb.current_item.promises).then () ->
        $scope.decideNextPage(route)
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
      return true


  $scope.setReady = () ->
    return false if !$scope.event 
    $scope.bb.current_item.setEvent($scope.event)
    return true
