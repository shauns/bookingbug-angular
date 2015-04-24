'use strict'

angular.module('BB.Directives').directive 'bbEvents', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'EventList'

  link : (scope, element, attrs) ->
    scope.summary = attrs.summary?

    options = scope.$eval attrs.bbEvents or {}

    # set the mode
    # 0 = Event summary (gets year summary and loads events a day at a time)
    # 1 = Next 100 events (gets next 100 events)
    # 2 = Next 100 events and event summary (gets event summary, loads next 100 events, and gets more events if requested)

    # TODO need to handle scenario where day selected, but event not loaded, as user scrolls months, grab more events and append to collection!
    # need to store when last event date is so we know how to adjust time range, index events by date
    
    scope.mode = if options and options.mode then options.mode else 0
    scope.mode = 0 if scope.summary
    return


angular.module('BB.Controllers').controller 'EventList', ($scope, $rootScope, EventService, $q, PageControllerService, FormDataStoreService, $filter, PaginationService) ->
  $scope.controller = "public.controllers.EventList"
  $scope.notLoaded $scope
  angular.extend(this, new PageControllerService($scope, $q))
  $scope.pick = {}
  $scope.start_date = moment()
  $scope.end_date = moment().add(1, 'year')
  $scope.filters = {}
  $scope.price_options = [0,1000,2500,5000]
  $scope.pagination = PaginationService.initialise({page_size: 10, max_size: 5})

  FormDataStoreService.init 'EventList', $scope, [
    'selected_date',
    'event_group_id',
    'event_group_set'
  ]
  
  #$scope.$setIfUndefined 'event_group_set', false
  $scope.event_group_set = if !$scope.event_group_set then false else $scope.current_item.event_group?

  $rootScope.connection_started.then ->
    $scope.initialise() if $scope.bb.company
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
  
  $scope.fully_booked = false


  $scope.initialise = () ->
    $scope.notLoaded $scope
    promises = []

    # compant question promise
    if $scope.bb.company.$has('company_questions')
      promises.push($scope.bb.company.getCompanyQuestionsPromise())
    else
      promises.push($q.when([]))
      $scope.has_company_questions = false

    # event group promise
    if !$scope.current_item.event_group
      promises.push($scope.bb.company.getEventGroupsPromise())
    else
      promises.push($q.when([]))

    # event summary promise
    if $scope.mode is 0 or $scope.mode is 2
      promises.push($scope.loadEventSummary())
    else
      promises.push($q.when([]))

    # event data promise
    if $scope.mode is 1 or $scope.mode is 2
      promises.push($scope.loadEventData()) 
    else
      promises.push($q.when([]))

    $q.all(promises).then (result) ->
      company_questions = result[0]
      event_groups      = result[1]
      event_summary     = result[2]
      event_data        = result[3]

      buildDynamicFilters(company_questions) if company_questions
      $scope.event_groups = _.indexBy(event_groups, 'id') if event_groups
      $scope.setLoaded $scope

    , (err) -> $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.loadEventSummary = () ->
    deferred = $q.defer()
    current_event = $scope.current_item.event
    if $scope.current_item.event
      delete $scope.current_item.event
      delete $scope.current_item.event_chain

    comp = $scope.bb.company 
    params = {item: $scope.bb.current_item, start_date:$scope.start_date.toISODate(), end_date:$scope.end_date.toISODate()}

    EventService.summary(comp, params).then (items) ->

      if items and items.length > 0

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

        # clear the selected date if the event group has changed (but only when event group has been explicity set)
        # if $scope.current_item? and $scope.current_item.event_group?
        #   if $scope.current_item.event_group.id != $scope.event_group_id
        #     $scope.showDate($scope.item_dates[0].date)
        #   $scope.event_group_id = $scope.current_item.event_group.id
        
        # if the selected date is within range of the dates loaded, show it, else show the first day loaded
        if $scope.mode is 0
          if ($scope.selected_date and ($scope.selected_date.isAfter($scope.item_dates[0].date) or $scope.selected_date.isSame($scope.item_dates[0].date)) and ($scope.selected_date.isBefore($scope.item_dates[$scope.item_dates.length-1].date) || $scope.selected_date.isSame($scope.item_dates[$scope.item_dates.length-1].date)))
            $scope.showDate($scope.selected_date)
          else
            $scope.showDate($scope.item_dates[0].date)

      deferred.resolve($scope.item_dates)

    , (err) -> deferred.reject()
    deferred.promise
 

  $scope.loadEventData = (comp) ->
    deferred = $q.defer()

    current_event = $scope.current_item.event

    if $scope.current_item.event
      delete $scope.current_item.event
      delete $scope.current_item.event_chain
      delete $scope.current_item.event_group # TODO only delete if the event group wasn't selected explicity
      delete $scope.current_item.tickets

    $scope.notLoaded $scope
    comp ||= $scope.bb.company 
    params = {item: $scope.bb.current_item, start_date:$scope.start_date.toISODate(), end_date:$scope.end_date.toISODate()}
    EventService.query(comp, params).then (items) ->
      #debugger
      $scope.items = items

      # get more event details
      for item in $scope.items
        item.prepEvent()
        # check if the current item already has the same event selected
        # if $scope.mode is 0 and current_event and current_event.self == item.self 
        #   item.select() 
        #   $scope.event = item

      # only build item dates if we're 'next 100 event' mode
      if $scope.mode is 1
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
          idate = parseInt($scope.start_date.format("YYYYDDDD"))
          $scope.item_dates = [{date:$scope.start_date, idate: idate, count:0, spaces:0}]

        # clear the selected date if the event group has changed
        # if $scope.current_item? && $scope.current_item.event_group?
        #   if $scope.current_item.event_group.id != $scope.event_group_id
        #     $scope.showDate($scope.item_dates[0].date)
        #   $scope.event_group_id = $scope.current_item.event_group.id
        # if ($scope.selected_date && ($scope.selected_date.isAfter($scope.item_dates[0].date) || $scope.selected_date.isSame($scope.item_dates[0].date)) && ($scope.selected_date.isBefore($scope.item_dates[$scope.item_dates.length-1].date) || $scope.selected_date.isSame($scope.item_dates[$scope.item_dates.length-1].date)))
        #   $scope.showDate($scope.selected_date)
        # else
        #   $scope.showDate($scope.item_dates[0].date)

      # determine if all events are fully booked
      isFullyBooked()

      $scope.filtered_items = $scope.items
      # run the filters to ensure any default filters get applied
      $scope.filterChanged()
      PaginationService.update($scope.pagination, $scope.filtered_items.length)

      $scope.setLoaded $scope
      deferred.resolve($scope.items)
    , (err) ->  deferred.reject()
    return deferred.promise


  isFullyBooked = () ->
    full_events = []
    for item in $scope.items
      full_events.push(item) if item.num_spaces == item.spaces_booked
    $scope.fully_booked = true if full_events.length == $scope.items.length


  # accepts moment date object
  $scope.showDate = (date) ->
    debugger
    if date
      # unselect the event if it's not on the day being selected
      if $scope.event and !$scope.selected_date.isSame(date, 'day')
        delete $scope.event

      if $scope.mode is 0
        new_date = date
        $scope.start_date = moment(date)
        $scope.end_date = moment(date)
        $scope.loadEventData()
      else
        new_date = date if !date.isSame($scope.selected_date, 'day')

      if new_date
        $scope.selected_date = new_date
        $scope.filters.date  = new_date.toDate()
      else
        delete $scope.selected_date
        delete $scope.filters.date

      $scope.filterChanged()

   
  $scope.$watch 'pick.date', (new_val, old_val) =>
    if new_val
      $scope.start_date = moment(new_val)
      $scope.end_date = moment(new_val)
      $scope.loadEventData()


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


  $scope.filterEvents = (item) ->
    result = (item.date.isSame(moment($scope.filters.date), 'day') or !$scope.filters.date?) and
      (($scope.filters.event_group and item.service_id == $scope.filters.event_group.id) or !$scope.filters.event_group?) and 
      (($scope.filters.price? and (item.price_range.from <= $scope.filters.price)) or !$scope.filters.price?) and
      (($scope.filters.hide_sold_out_events and item.getSpacesLeft() != 0) or !$scope.filters.hide_sold_out_events) and
      filterEventsWithDynamicFilters(item)
    return result


  filterEventsWithDynamicFilters = (item) ->

    return true if !$scope.has_company_questions or !$scope.dynamic_filters

    result = true

    for type in $scope.dynamic_filters.question_types
      for filter in $scope.dynamic_filters[type]
        name = filter.name.parameterise('_')
        filter = ($scope.dynamic_filters.values[filter.name] and item.chain.extra[name] is $scope.dynamic_filters.values[filter.name].name) or !$scope.dynamic_filters.values[filter.name]?
        result = result and filter
    return result


  $scope.filterDateChanged = () ->
    $scope.filterChanged()
    $scope.showDate(moment($scope.filters.date))


  $scope.resetFilters = () ->
    $scope.filters = {}
    $scope.dynamic_filters.values = {} if $scope.has_company_questions
    $scope.filterChanged()


  # builds dynamic filters using company questions
  buildDynamicFilters = (questions) ->
    $scope.dynamic_filters                = _.groupBy(questions, 'question_type')
    $scope.dynamic_filters.question_types = _.uniq(_.pluck(questions, 'question_type'))
    $scope.dynamic_filters.values         = {}


  # TODO build price filter by determiniug price range, if range is large enough, display price filter
  # buildPriceFilter = () ->
  #   for item in items 


  sort = () ->
   # TODO allow sorting by price/date (default)


  $scope.filterChanged = () ->
    if $scope.items
      $scope.filtered_items = $filter('filter')($scope.items, $scope.filterEvents)
      $scope.pagination.num_items = $scope.filtered_items.length
      $scope.filter_active = $scope.filtered_items.length != $scope.items.length
      PaginationService.update($scope.pagination, $scope.filtered_items.length)


  $scope.pageChanged = () ->
    PaginationService.update($scope.pagination, $scope.filtered_items.length)
    $rootScope.$broadcast "page:changed"

