'use strict';

angular.module('BB.Directives').directive 'bbTimeRanges', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TimeRangeList',


# TODO Get the add/subtract functions to respect the current time range. Get the time range length to adjust if display mode is preset
angular.module('BB.Controllers').controller 'TimeRangeList',
($scope, $element, $attrs, $rootScope, $q, TimeService, AlertService, BBModel, FormDataStoreService) ->

  $scope.controller = "public.controllers.TimeRangeList"
 
  # store the form data for the following scope properties
  currentPostcode = $scope.bb.postcode

  FormDataStoreService.init 'TimeRangeList', $scope, [
    'selected_date'
    'selected_day'
    'selected_slot'
    'postcode'
  ]

  # check to see if the user has changed the postcode and remove data if they have
  if currentPostcode isnt $scope.postcode
    $scope.selected_slot = null
    $scope.selected_date = null

  # store the postocde
  $scope.postcode = $scope.bb.postcode

  # show loading icon
  $scope.notLoaded $scope

  # if the data source isn't set, set it as the current item
  if !$scope.data_source
    $scope.data_source = $scope.bb.current_item


  $rootScope.connection_started.then ->

    # read initialisation attributes
    $scope.time_range_length = $scope.$eval($attrs.bbTimeRangeLength) or 7
    $scope.day_of_week       = $scope.$eval($attrs.bbDayOfWeek) if $attrs.bbDayOfWeek?

    if $attrs.bbSelectedDay?
      selected_day        = moment($scope.$eval($attrs.bbSelectedDay))
      $scope.selected_day = moment(selected_day) if moment.isMoment(selected_day)


    # selected day has been stored, use this to set the time
    if $scope.selected_day
      $scope.dont_move_to_week_start = true
      setTimeRange($scope.selected_day)
    # last selected day is set (i.e, a user has already selected a date)
    else if !$scope.current_date && $scope.last_selected_date
      setTimeRange($scope.last_selected_date)
    # the current item already has date
    else if $scope.bb.current_item.date
      setTimeRange($scope.bb.current_item.date.date)
    # set the time range as today
    else
      setTimeRange(moment())

    $scope.loadData()

  , (err) -> $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  setTimeRange = (start_date) ->
    $scope.selected_day = start_date
    if $scope.day_of_week
      $scope.current_date = start_date.clone().day($scope.day_of_week)
    else if $scope.dont_move_to_week_start
      $scope.current_date = start_date.clone()
    else
      $scope.current_date = start_date.clone().startOf('week')
    # convert selected day to JS date object for date picker, it needs
    # to be saved as a variable as functions cannot be passed into the
    # AngluarUI date picker
    $scope.selected_date = $scope.selected_day.toDate()
    return


  # deprecated, please use bbSelectedDay to initialise the selected_day
  $scope.init = (options = {}) ->
    if options.selected_day?
      unless options.selected_day._isAMomementObject
        $scope.selected_day = moment(options.selected_day)


  $scope.moment = () ->
    moment()


  $scope.setDataSource = (source) ->
    $scope.data_source = source


  # when the current item is updated, reload the time data
  $scope.$on "currentItemUpdate", (event) ->
    $scope.loadData()


  $scope.add = (type, amount) ->
    $scope.selected_day = moment($scope.selected_date)
    switch type
      when 'days'
        setTimeRange($scope.selected_day.add(amount, 'days'))
      when 'weeks'
        $scope.current_date.add(amount, 'weeks')
        setTimeRange($scope.current_date)
    $scope.loadData()


  $scope.subtract = (type, amount) ->
    $scope.add(type, -amount)


  $scope.isSubtractValid = (type, amount) ->
    return true if !$scope.current_date
    date = $scope.current_date.clone().subtract(amount, type)
    return !date.isBefore(moment(), 'day')
 

  # called on datepicker date change
  $scope.selectedDateChanged = () ->
    setTimeRange(moment($scope.selected_date))
    $scope.selected_slot = null
    $scope.loadData()


  updateHideStatus = () ->
    for day in $scope.days
      day.hide = !day.date.isSame($scope.selected_day,'day')


  # calculate if the current earliest date is in the past - in which case we
  # might want to disable going backwards
  $scope.isPast = () ->
    return true if !$scope.current_date
    return moment().isAfter($scope.current_date)




  # check the status of the slot to see if it has been selected
  $scope.status = (day, slot) ->
    return if !slot

    status = slot.status()
    return status
    # the view was originally calling the slot.status(). this logic below is for
    # storing the time but we're not doing this for now so we just return status
    # selected = $scope.selected_slot
    # if selected and selected.time is slot.time and selected.date is slot.date
    #   return status = 'selected'
    # return status


  # called when user selects a time slot
  # use this when you want to route to the next step as a slot is selected
  $scope.selectSlot = (day, slot, route) ->
    if slot && slot.availability() > 0
      $scope.bb.current_item.setTime(slot)

      if day
        $scope.setLastSelectedDate(day.date)
        $scope.bb.current_item.setDate(day)

      if $scope.bb.current_item.reserve_ready
        $scope.notLoaded $scope
        $scope.addItemToBasket().then () ->
          $scope.setLoaded $scope
          $scope.decideNextPage(route)
        , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
      else
        $scope.decideNextPage(route)


  # called when user selects a time slot
  # use this when you just want to hightlight the the slot and not progress to the next step
  $scope.highlightSlot = (day, slot) ->
    curItem = $scope.bb.current_item

    if slot && slot.availability() > 0
      if day
        $scope.setLastSelectedDate(day.date)
        curItem.setDate(day)

      curItem.setTime(slot)
      curItem.setDate(day)
      $scope.selected_slot = slot
      $scope.selected_day = day.date
      $scope.selected_date = day.date.toDate()
      updateHideStatus()
      $rootScope.$emit "time:selected"
      # broadcast message to the accordian range groups
      $scope.$broadcast 'slotChanged'
      


  # load the time data
  $scope.loadData = ->
    curItem = $scope.bb.current_item

    # has a service been selected?
    if curItem.service
      $scope.min_date = curItem.service.min_advance_datetime
      $scope.max_date = curItem.service.max_advance_datetime
      # if the selected day is before the services min_advance_datetime, adjust the time range
      setTimeRange(curItem.service.min_advance_datetime) if $scope.selected_day && $scope.selected_day.isBefore(curItem.service.min_advance_datetime, 'day')


    date = $scope.current_date
    edate = moment(date).add($scope.time_range_length, 'days')
    $scope.end_date = moment(edate).add(-1, 'days')

    AlertService.clear()
    # We may not want the current item duration to be the duration we query by
    # If min_duration is set, pass that into the api, else pass in the duration
    duration = $scope.bb.current_item.duration
    if $scope.bb.current_item.min_duration
      duration = $scope.bb.current_item.min_duration    

    loc = null
    if $scope.bb.postcode
      loc = ",,,," + $scope.bb.postcode + ","

    if $scope.data_source && $scope.data_source.days_link
      $scope.notLoaded $scope
      loc = null
      loc = ",,,," + $scope.bb.postcode + "," if $scope.bb.postcode
      promise = TimeService.query(
        company: $scope.bb.company
        cItem: $scope.data_source
        date: date
        client: $scope.client
        end_date: $scope.end_date
        duration: duration
        location: loc
        num_resources: $scope.bb.current_item.num_resources
      )

      promise.finally ->
        $scope.setLoaded $scope

      promise.then (dateTimeArr) ->
        $scope.days = []
        # if it is a move booking, set the date it occurs on to be availble if not already marked as available
        # doesn't handle multi day bookings as we don't handle multiday bookings
        if $scope.bb.moving_booking?
          move_date = $scope.bb.moving_booking.datetime
          if date <= move_date && edate >= move_date
            if dateTimeArr[move_date.format("YYYY-MM-DD")].length == 0
              v = move_date.minutes() + move_date.hours() * 60
              dateTimeArr[move_date.format("YYYY-MM-DD")].splice(0, 0, new BBModel.TimeSlot({time: v, avail: 1}, curItem))
            else
              for slot in dateTimeArr[move_date.format("YYYY-MM-DD")]
                if (curItem.time and curItem.time.time is slot.time)
                  slot.avail = 1
        for pair in _.sortBy(_.pairs(dateTimeArr), (pair) -> pair[0])
          d = pair[0]
          timeSlotsArr = pair[1]
          day = {date: moment(d), slots: timeSlotsArr}
          $scope.days.push(day)

          # restores data when using the back/forward buttons
          # add the date and time to the cuurent item if was selected before.
     #     if day.date.isSame($scope.selected_date) && $scope.selected_slot
     #       for slot in timeSlotsArr
     #         if slot.time is $scope.selected_slot.time
     #           $scope.bb.current_item.date = day
     #           $scope.bb.current_item.time = slot

          # padding is used to ensure that a list of time slots is always padded
          # out with a certain of values, if its a partial set of results
          if $scope.add_padding && timeSlotsArr.length > 0
            dtimes = {}
            for slot in timeSlotsArr
              dtimes[slot.time] = 1
              # add date to slot as well
              slot.date = day.date.format('DD-MM-YY')

            for pad, v in $scope.add_padding
              if (!dtimes[pad])
                timeSlotsArr.splice(v, 0, new BBModel.TimeSlot({time: pad, avail: 0}, timeSlotsArr[0].service))

          if (curItem.requested_time or curItem.time) and day.date.isSame(curItem.date.date)
            found_time = false

            for slot in timeSlotsArr
              if (slot.time is curItem.requested_time)
                curItem.requestedTimeUnavailable()
                $scope.selectSlot(day, slot)
                found_time = true
                $scope.days = []
                return  # hey if we just picked the day and routed - then move on!

              if (curItem.time and curItem.time.time is slot.time and slot.avail is 1)
                if $scope.selected_slot and $scope.selected_slot.time isnt curItem.time.time
                  $scope.selected_slot = curItem.time
                  #console.log ("Timings are out of sync")
                curItem.setTime(slot)  # reset it - just in case this is really a new slot!
                found_time = true

            if !found_time
              # if we didn't find the time - give up and do force it's selecttion
              curItem.requestedTimeUnavailable()
              AlertService.add("danger", { msg: "Sorry, your requested time slot is not available. Please choose a different time." })
        updateHideStatus()
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    else
      $scope.setLoaded $scope


  $scope.padTimes = (times) ->
    $scope.add_padding = times


  $scope.setReady = () ->
    if !$scope.bb.current_item.time
      AlertService.add("danger", { msg: "You need to select a time slot" })
      return false
    else if $scope.bb.moving_booking && $scope.bb.current_item.datetime.isSame($scope.bb.current_item.original_datetime)
      AlertService.add("danger", { msg: "Your appointment is already booked for this time." })
      return false
    else
      if $scope.bb.current_item.reserve_ready
        return $scope.addItemToBasket()
      else
        return true


  $scope.format_date = (fmt) ->
    if $scope.current_date
      $scope.current_date.format(fmt)


  $scope.format_start_date = (fmt) ->
    $scope.format_date(fmt)


  $scope.format_end_date = (fmt) ->
    if $scope.end_date
      $scope.end_date.format(fmt)


  $scope.pretty_month_title = (month_format, year_format, seperator = '-') ->
    month_year_format = month_format + ' ' + year_format
    if $scope.current_date && $scope.end_date && $scope.end_date.isAfter($scope.current_date, 'month')
      start_date = $scope.format_start_date(month_format)
      start_date = $scope.format_start_date(month_year_format) if $scope.current_date.month() == 11
      return start_date + ' ' + seperator + ' ' + $scope.format_end_date(month_year_format)
    else
      return $scope.format_start_date(month_year_format)

