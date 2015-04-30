angular.module('BBClinic').controller 'bbClinicCalController', ($scope, $log, $modal, $q,
    AdminServiceService, AdminResourceService, AdminPersonService, AdminAddressService, AdminClinicService, ModalForm, BBModel, $interval, $sessionStorage, $filter, $localStorage) ->

  $scope.loading = true
#  $scope.clinics = []
  dash_ready_def = $q.defer()
  $scope.dash_ready = dash_ready_def.promise

  $scope.getClinicCalSetup = () ->

    params =
      company: $scope.company
    AdminServiceService.query(params).then (services) ->
      $scope.services = services
    , (err) ->
      $log.error err.data

    AdminResourceService.query(params).then (resources) ->
      $scope.resources = resources
    , (err) ->
      $log.error err.data


    AdminAddressService.query(params).then (addresses) ->
      $scope.addresses = addresses
    , (err) ->
      $log.error err.data


    AdminPersonService.query(params).then (people) =>
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
      dash_ready_def.resolve()

    , (err) ->
      $log.error err.data



  $scope.getClinics = (start, end, tz, callback) ->
    console.log start, end, callback

    $scope.dash_ready.then () ->
      prms = {company: $scope.company}
      prms.start_date = start.format("YYYY-MM-DD")
      prms.end_date = end.format("YYYY-MM-DD")

      clinics = AdminClinicService.query(prms)
      clinics.then (s) =>
        console.log s
        for c in s
          if c.resource_ids.length == 0 && c.person_ids.length == 0
            c.className = 'noPeopleOrResources'
        callback(s)
#      s.addCallback (booking) =>
#        $scope.myCalendar.fullCalendar('renderEvent',booking, true)

  $scope.clinics = [$scope.getClinics]


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

  $scope.selectTime = (start, end, allDay) ->
    $scope.$apply =>
      $scope.popupClinicAction({start_time: moment(start), end_time: moment(end), allDay: allDay})
      $scope.myCalendar.fullCalendar('unselect');

  # a popup performing an action on a time, possible blocking, or mkaing a new booking
  $scope.popupClinicAction = (prms) ->
    console.log(prms)

    modalInstance = $modal.open {
      templateUrl: 'edit_clinic.html',
      controller: ModalInstanceCtrl,
      scope: $scope,
      backdrop: false,
      resolve: {
        items: () => prms;
      }
    }

  $scope.clinicClick = (clinic) ->
    $scope.popupClinicAction({ clinic: clinic })

  $scope.updateClinic = (clinic) ->
    AdminClinicService.update(clinic).then (clinic) ->
      console.log "updated clinic", clinic
      $scope.clinics = [$scope.getClinics]

  ModalInstanceCtrl = ($scope, $modalInstance, items) ->
    #angular.extend($scope, items)
    $scope.existingClinic = items.clinic?
    if $scope.existingClinic
      $scope.clinic = items.clinic
    else
      $scope.clinic = new BBModel.Admin.Clinic(items) unless $scope.clinic?
    console.log $scope.clinic
    $scope.ok = () ->
      console.log $scope.clinic
      if typeof $scope.clinic._data.$has == 'function' && $scope.clinic.$has('self')
        $scope.clinic.save().then (clinic) ->
          if $scope.clinic.resource_ids.length == 0 && $scope.clinic.person_ids.length == 0
            $scope.clinic.className = 'noPeopleOrResources'
          $modalInstance.close()
      else
        AdminClinicService.create({company: $scope.company}, $scope.clinic).then (clinic) ->
          console.log "created clinic", clinic
          if clinic.resource_ids.length == 0 && clinic.person_ids.length == 0
            clinic.className = 'noPeopleOrResources'
          $scope.clinics.push clinic
          $modalInstance.close();
      
    $scope.cancel = () ->
      $modalInstance.dismiss('cancel');
    

  # config object
  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'month agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      dayClick: $scope.dayClick,
      eventClick: $scope.clinicClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
      selectable: true,
      selectHelper: true,
      select: $scope.selectTime,

    }
  }

