'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletDashboard', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletDashboard'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletDashboard', ($scope,  $rootScope, $q, $filter, $modal, $state, $localStorage, AdminTimeService, AdminBookingService) ->
  $scope.open_datepicker = ($event) ->
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened_datepicker = true

  $rootScope.connection_started.then ->
    $scope.notLoaded $scope
    $scope.person_display_index = 0
    $scope.person_max_dash = 4
    $scope.pusherSubscribe()
    $scope.bb.company.getPeoplePromise().then (people) ->
      people = people.filter (p) -> p.$has('enabled_services')
      people = $filter('orderBy')(people, 'order')
      hasSelected = $localStorage.selectedPeople?
      $localStorage.selectedPeople = [] if !hasSelected
      $scope.people = people
      for person in people
        if hasSelected
          person.show = $localStorage.selectedPeople.indexOf(person.id) >= 0
        else
          person.show = true
          $localStorage.selectedPeople.push(person.id)
      $scope.selectedAll = ($scope.shownPeople().length == $scope.people.length)
      
      $scope.dash_table_style = $scope.dashTableTdWidth()
      $scope.updateCal()
      $scope.bb.company.getServicesPromise().then (services) ->
        $scope.services = services

  $scope.toggle_all_people = ->
    if !$scope.selectedAll 
      $scope.show_all_people()
    else 
      $scope.hide_all_people()

  $scope.show_all_people = ->
    for person in $scope.people
      person.show = true
      $localStorage.selectedPeople.push(person.id) if $localStorage.selectedPeople.indexOf(person.id) < 0
    $scope.selectedAll = true

  $scope.hide_all_people = ->
    for person in $scope.people
      person.show = false
    $localStorage.selectedPeople = []
    $scope.selectedAll = false

  $scope.togglePerson = (person) =>
    person.show = !person.show
    
    if person.show
      $localStorage.selectedPeople.push(person.id)
    else
      $localStorage.selectedPeople = $localStorage.selectedPeople.filter (p) -> p != person.id
    
    $scope.resetPersonSet()
    $scope.selectedAll = ($scope.shownPeople().length == $scope.people.length)
    $scope.dash_table_style = $scope.dashTableTdWidth()

  $scope.dashTableTdWidth = () ->
    if $scope.shownPeople().length < $scope.person_max_dash
      { width: ("#{100 / $scope.shownPeople().length}%") }
    else
      { width: ("#{100 / $scope.person_max_dash}%") }

  $scope.$on 'dateChanged', (event, newdate) =>
    $scope.bookings = null
    $scope.updateCal()
    
  $scope.$on "$destroy", =>
    $scope.clearClient() if $scope.clearClient?

  $scope.updateCal = () =>
    return if !$scope.bb_date.date || !$scope.people

    $scope.notLoaded $scope
    
    prms = { company_id: $scope.bb.company_id, date: $scope.bb_date.date.format("YYYY-MM-DD") }

    timeListDef = $q.defer()
    prms.url = $scope.bb.api_url
    
    $scope.allTimes = []
    $scope.peopleBookings = {}
    allPromises = []
    
    for person in $scope.people
      t_prms = prms
      t_prms.person_id = person.id
      $scope.peopleBookings[person.id] ?= {}
      
      allPromises.push AdminTimeService.query(t_prms).then (res) =>
        for eventItem in res
          personID = eventItem.person_id
          for timeItem in eventItem.times
            $scope.allTimes.push(timeItem.time) if timeItem.time not in $scope.allTimes
            $scope.peopleBookings[personID][timeItem.time] ?= {}
            $scope.peopleBookings[personID][timeItem.time].available ?= false
            $scope.peopleBookings[personID][timeItem.time].available |= (timeItem.avail != 0)

    if !$scope.bookings?
      allPromises.push AdminBookingService.query(prms).then (bookings) =>
        bookings.addCallback $scope, (booking, status) =>
          # Blank out booking attributes
          for person in $scope.people
            if $scope.peopleBookings[person.id]?
              if $scope.peopleBookings[person.id][0]?
                $scope.peopleBookings[person.id][0].booking = null
              for time in $scope.allTimes
                if $scope.peopleBookings[person.id][time]?
                  $scope.peopleBookings[person.id][time].booking = null
            
          $scope.refreshBookings()
          
        $scope.bookings = bookings
        $scope.refreshBookings()
          
    $q.all(allPromises).then ->
      $scope.allTimes.sort (a,b) ->
        return a-b
      
      if $scope.allTimes.length > 1
        for i in [0..$scope.allTimes.length]
          timeslot_length = $scope.allTimes[1+i] - $scope.allTimes[i]
          if (timeslot_length < $scope.bb.timeslot_length || !$scope.bb.timeslot_length?)
            $scope.bb.timeslot_length = timeslot_length
            $scope.refreshBookings()

      $scope.setLoaded $scope
      $scope.setPageLoaded()
      
  $scope.refreshBookings = () =>
    for booking in $scope.bookings.items
      $scope.peopleBookings[booking.person_id] ?= {}
      startTime = booking.start.minutes() + (booking.start.hours() * 60)
      $scope.allTimes.push startTime if (startTime > 0) && !(startTime in $scope.allTimes)
      $scope.peopleBookings[booking.person_id][startTime] ?= {}
      $scope.peopleBookings[booking.person_id][startTime].booking = booking
      endTime = booking.end.minutes() + (booking.end.hours() * 60)

      if (startTime > 0) && $scope.bb.timeslot_length? && (endTime > (startTime + $scope.bb.timeslot_length))
        for i in [startTime...endTime] by $scope.bb.timeslot_length
          $scope.allTimes.push i if i not in $scope.allTimes
          $scope.peopleBookings[booking.person_id][i] ?= {}
          $scope.peopleBookings[booking.person_id][i].booking = booking
        
    $scope.allTimes.sort (a,b) ->
      return a-b

  $scope.findBooking = (person, time) =>
    hasBooking  = $scope.peopleBookings?
    hasBooking &= $scope.peopleBookings[person.id]?
    hasBooking &= $scope.peopleBookings[person.id][time]?
    
    return $scope.peopleBookings[person.id][time].booking if hasBooking
    null

  $scope.allDayBlocking = (person) =>
    couldHaveBlocking  = $scope.peopleBookings?
    couldHaveBlocking &= $scope.peopleBookings[person.id]?
    couldHaveBlocking &= $scope.peopleBookings[person.id][0]?
    return $scope.peopleBookings[person.id][0].booking if couldHaveBlocking
    return null

  $scope.isAvailable = (person, time) =>
    if $scope.peopleBookings? && $scope.peopleBookings[person.id]? && $scope.peopleBookings[person.id][time]?
      return $scope.peopleBookings[person.id][time].available
    return false
    
  $scope.openModal = (template, time, extra) =>
    modalScope = $scope.$new(true)
    modalScope.bb_date = $scope.bb_date
    modalScope.person = extra.person
    modalScope.booking = extra.booking
    modalScope.time = time
    if extra.booking?
      modalScope.time = extra.booking.start.minutes() + (extra.booking.start.hours() * 60)
    modalScope.blocking = extra.blocking
    modalScope.allDay = extra.allDay
    modalScope.company_id = $scope.bb.company_id 
    modalScope.widget_settings = $scope.bb.widget_settings
    if $scope.bb.widget_routes?
      modalScope.widget_routes = $scope.bb.widget_routes

    unless modalScope.widget_settings.item_defaults?
      modalScope.widget_settings.item_defaults = {}
    modalScope.widget_settings.item_defaults.date = $scope.bb_date.date
    modalScope.widget_settings.item_defaults.time = time
    if extra.person?
      modalScope.widget_settings.item_defaults.person = extra.person.id
    unless modalScope.widget_settings.company_id
      modalScope.widget_settings.company_id = $scope.bb.company_id
    unless modalScope.widget_settings.clear_member
      modalScope.widget_settings.clear_member = true
    unless modalScope.widget_settings.admin
      modalScope.widget_settings.admin = true
    unless modalScope.widget_settings.page_suffix
      modalScope.widget_settings.page_suffix = ".html"

    if extra.booking?
      booking = extra.booking
      modalScope.completed = booking.hasStatus('completed')
      modalScope.no_show = booking.hasStatus('no_show')
      modalScope.checked_in = booking.hasStatus('checked_in')
      modalScope.being_seen = booking.hasStatus('being_seen')
      
      if (modalScope.completed)
        $state.go('booking', {id: booking.id})
        return
    
    modalInstance = $modal.open
      templateUrl: template,
      scope: modalScope,
      windowClass: extra.windowClass
    
    modalScope.$on "processDone", () =>
      modalInstance.close()

    modalInstance.result.then (result) =>
      if result
        if result.no_show
          $scope.notLoaded $scope
          prms = 
            company_id: $scope.bb.company_id
            notify: false
          
          AdminBookingService.addStatusToBooking(prms, modalScope.booking, result.status).then (res) =>
            booking = res
            
            AdminBookingService.cancelBooking(prms, booking).then (res) =>
              $scope.setLoaded $scope
          
        else if result.status?
          if result.status == 'no_show'
            $scope.openModal(result.modal, modalScope.time, extra)
          else
            $scope.notLoaded $scope
            prms = { company_id: $scope.bb.company_id }
          
            AdminBookingService.addStatusToBooking(prms, modalScope.booking, result.status).then (res) =>
              booking = res
              $scope.setLoaded $scope
              $state.go('booking', {id: booking.id}) if result.status == 'completed'
        else if result.unblock?
          $scope.notLoaded $scope
          prms = 
            company_id: $scope.bb.company_id
            notify: false
          
          AdminBookingService.cancelBooking(prms, result.unblock).then (res) =>
            blocking = res
            $scope.setLoaded $scope
        else if result.block?
          prms = {}
          $scope.notLoaded $scope
          
          if result.block.allDay? && result.block.allDay
            prms = 
              company_id: $scope.bb.company_id
              start_time: $scope.bb_date.date.clone().startOf('day')
              end_time: $scope.bb_date.date.clone().endOf('day')
              allday: true
          else
            momentStart = $scope.bb_date.date.clone().startOf('day').add('minutes', time)
            momentEnd = momentStart.clone().add('minutes', $scope.bb.timeslot_length)
            prms = 
              company_id: $scope.bb.company_id
              start_time: momentStart.toISOString()
              end_time: momentEnd.toISOString()
          
          AdminBookingService.blockTimeForPerson(prms, modalScope.person).then (res) =>
            booking = res
            $scope.setLoaded $scope
              
        else if result.modal?
          extra.windowClass = "model-large"
          $scope.clearClient()
          $scope.openModal(result.modal, time, extra)

  $scope.shownPeople = () ->
    $scope.people.filter (p) -> p.show == true

  $scope.notShownPeople = () ->
    $scope.people.filter (p) -> p.show == false

  $scope.resetPersonSet = () ->
    if $scope.person_display_index + $scope.person_max_dash >  $scope.shownPeople().length
      $scope.person_display_index -= 1
      if $scope.person_display_index < 0
        $scope.person_display_index = 0

  $scope.nextPersonSet = () ->
    $scope.person_display_index += $scope.person_max_dash
    if ($scope.person_display_index + $scope.person_max_dash) > $scope.shownPeople().length
      $scope.person_display_index = $scope.shownPeople().length - $scope.person_max_dash

  $scope.previousPersonSet = () ->
    $scope.person_display_index -= $scope.person_max_dash
    if $scope.person_display_index < 0
      $scope.person_display_index = 0
