'use strict'

angular.module('BB.Directives').directive 'bbEvents', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'EventList'

  link : (scope, element, attrs) ->
    scope.summary = attrs.summary

    options = scope.$eval attrs.bbEvents or {}

    # set the mode
    # 0 = Next 100 events
    # 1 = Event summary
    # 2 = Next 100 events and event summary
    scope.mode = if options and options.mode then options.mode else 0
    scope.mode = 1 if scope.summary
    return


angular.module('BB.Controllers').controller 'EventList', ($scope,  $rootScope, EventService, $q, PageControllerService, FormDataStoreService, $filter) ->
  $scope.controller = "public.controllers.EventList"
  $scope.notLoaded $scope
  angular.extend(this, new PageControllerService($scope, $q))
  $scope.pick = {}
  $scope.start_date = moment()
  $scope.end_date = moment().add(1, 'year')
  $scope.filters = {}
  $scope.price_options = [0,1000,2500,5000]
  $scope.pagination = {current_page: 1, page_size: 10, num_pages: null, max_size: 5, num_items: null}


  FormDataStoreService.init 'EventList', $scope, [
    'selected_date',
    'event_group_id'
  ]
  
  #$scope.$setIfUndefined 'event_group_set', false
  $scope.start_date = moment()
  $scope.end_date   = moment().add(1, 'year')
  $scope.event_group_set = if !$scope.event_group_set then false else $scope.current_item.event_group?


  $rootScope.connection_started.then ->
    if $scope.bb.company

      if $scope.summary then $scope.getSummary() else $scope.init()

      if !$scope.current_item.event_group
        loadEventGroups()

      buildDynamicFilters()

  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
  
  $scope.fully_booked = false


  $scope.getSummary = () ->
    current_event = $scope.current_item.event
    if $scope.current_item.event
      delete $scope.current_item.event
      delete $scope.current_item.event_chain

    $scope.notLoaded $scope
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

        # clear the selected date if the event group has changed
        if $scope.current_item? and $scope.current_item.event_group?
          if $scope.current_item.event_group.id != $scope.event_group_id
            $scope.showDate($scope.item_dates[0].date)
          $scope.event_group_id = $scope.current_item.event_group.id
        # if the selected date is within range of the dates loaded, show it, else show the first day loaded
        if ($scope.selected_date and ($scope.selected_date.isAfter($scope.item_dates[0].date) or $scope.selected_date.isSame($scope.item_dates[0].date)) and ($scope.selected_date.isBefore($scope.item_dates[$scope.item_dates.length-1].date) || $scope.selected_date.isSame($scope.item_dates[$scope.item_dates.length-1].date)))
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
      delete $scope.current_item.event_group # TODO only delete if the event group wasn't selected explicity

    $scope.notLoaded $scope
    comp ||= $scope.bb.company 
    params = {item: $scope.bb.current_item, start_date:$scope.start_date.toISODate(), end_date:$scope.end_date.toISODate()}
    EventService.query(comp, params).then (items) ->

      $scope.items = items

      # check if the current item already has the same event selected
      for item in $scope.items
        item.prepEvent()
        if current_event and current_event.self == item.self and false # TODO only restore the event if an event group was explicity selected
          item.select() 
          $scope.event = item

      # if we're not in summary mode
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
      $scope.pagination.num_items = $scope.filtered_items.length


      $scope.setLoaded $scope
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  isFullyBooked = () ->
    full_events = []
    for item in $scope.items
      item.getDuration()
      if item.num_spaces == item.spaces_booked
        full_events.push(item)
      else
        item.qty = 1
    if (full_events.length) == $scope.items.length
      $scope.fully_booked = true


  # accepts moment date object
  $scope.showDate = (date) ->
    if date

      # unselect the event if it's not on the day being selected
      if $scope.event and !$scope.selected_date.isSame(date, 'day')
        delete $scope.event

      if $scope.summary
        new_date = date
        $scope.start_date = moment(date)
        $scope.end_date = moment(date)
        $scope.init()
      else
        new_date = date if !date.isSame($scope.selected_date, 'day')

      if new_date
        $scope.selected_date = new_date
        $scope.filters.date  = new_date.toDate()
      else
        delete $scope.selected_date
        delete $scope.filters.date

      $scope.filterChanged()

   
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
      item.image = $scope.event_groups[item.service_id].image if $scope.event_groups and $scope.event_groups[item.service_id].image
      $scope.bb.current_item.setEvent(item)
      $scope.bb.current_item.ready = false
      $q.all($scope.bb.current_item.promises).then () ->
        $scope.decideNextPage(route)
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
      return true


  $scope.setReady = () ->
    return false if !$scope.event 
    # $scope.event.image = $scope.event_groups[$scope.event.service_id].image if $scope.event_groups[$scope.event.service_id].image
    $scope.bb.current_item.setEvent($scope.event)
    return true


  loadEventGroups = () ->
    $scope.bb.company.getEventGroupsPromise().then (items) ->

      $scope.event_groups = _.indexBy(items, 'id')
     
      for event_group_id, event_group of $scope.event_groups
        event_group.getImagesPromise().then (images) ->
          # TODO pick most promiment image
          if images and images.length > 0
            image = images[0]
            image.background_css = {'background-image': 'url(' + image.url + ')'}
            $scope.event_groups[images[0].foreign_key].image = image
            # debugger
            # colorThief = new ColorThief()
            # colorThief.getColor image.url


  $scope.filterEvents = (item) ->
    result = (item.date.isSame(moment($scope.filters.date), 'day') or !$scope.filters.date?) and
      (($scope.filters.event_group and item.service_id == $scope.filters.event_group.id) or !$scope.filters.event_group?) and 
      (($scope.filters.price? and (item.price_range.from <= $scope.filters.price)) or !$scope.filters.price?) and
      (($scope.filters.hide_sold_out_events and item.getSpacesLeft() != 0) or !$scope.filters.hide_sold_out_events) and
      filterEventsWithDynamicFilters(item)
    return result


  filterEventsWithDynamicFilters = (item) ->
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
    $scope.dynamic_filters.values = {}
    $scope.filterChanged()


  # builds dynamic filters using company questions
  buildDynamicFilters = () ->
    $scope.bb.company.getCompanyQuestionsPromise().then (questions) ->
      $scope.dynamic_filters                = _.groupBy(questions, 'question_type')
      $scope.dynamic_filters.question_types = _.uniq(_.pluck(questions, 'question_type'))
      $scope.dynamic_filters.values         = {}



  # TODO build price filter by determiniug price range, if range is large enough, display price filter
  # buildPriceFilter = () ->
  #   for item in items 


  sort = () ->
   # TODO allow sorting by price/date 


#   $scope.$watch "pagination", () ->
#     begin = (($scope.pagination.current_page - 1) * $scope.pagination.page_size)
#     end = begin + $scope.pagination.numPerPage
#     $scope.filteredTodos = $scope.todos.slice(begin, end)
#     return
# scope.pagination = {current_page: 1, page_size: 10, num_pages: null, max_size: 5, num_items: null}


  $scope.filterChanged = () ->
    $scope.filtered_items = $filter('filter')($scope.items, $scope.filterEvents);
    $scope.pagination.num_items = $scope.filtered_items.length
    $scope.filter_active = $scope.filtered_items.length != $scope.items.length


  $scope.pageChanged = () ->
    $rootScope.$emit "page:changed"

