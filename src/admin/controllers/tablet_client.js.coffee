'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletClient', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletClient'
  link : (scope, element, attrs) ->
    if attrs.client
      scope.client_id = attrs.client
    return


angular.module('BBAdmin.Controllers').controller 'TabletClient', ($scope,  $rootScope, $q, $modal, AdminClientService, MemberBookingService, ClientDetailsService, AlertService) ->

  $scope.goBack = () =>
    window.history.back()

  $scope.clientDef = $q.defer()
  $scope.clientPromise = $scope.clientDef.promise 

  $rootScope.connection_started.then ->
    $scope.notLoaded $scope
    AdminClientService.query({company_id:$scope.bb.company_id, id:$scope.client_id}).then (client) =>
      $scope.client = client
      $scope.clientDef.resolve(client)
      $scope.setLoaded $scope
      $scope.setPageLoaded()
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    ClientDetailsService.query($scope.bb.company).then (details) =>
      $scope.client_details = details
      $scope.setLoaded $scope


  $scope.getHistoricalBookings = (type, num) =>
    $scope.notLoaded $scope
    date = moment().add(type, num)
    params =
      start_date: date.format('YYYY-MM-DD')
      end_date: moment().format('YYYY-MM-DD')

    params.per_page = @limit if @limit

    $scope.clientPromise.then ->
      MemberBookingService.query($scope.client, params).then (bookings) ->
        $scope.setLoaded $scope
        $scope.past_bookings = bookings
        $scope.past_bookings_ids = []
        $scope.past_bookings_map = {}      
        for item in $scope.past_bookings
          $scope.past_bookings_ids.push(item.id)
          $scope.past_bookings_map[item.id] = item


      , (err) ->
        $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

  $scope.removeBooking = (booking) =>
    if $scope.upcoming_bookings
      $scope.upcoming_bookings = $scope.upcoming_bookings.filter (b) -> b.id != booking.id
      $scope.upcoming_bookings_ids = []
      $scope.upcoming_bookings_map = {}      
      for item in $scope.upcoming_bookings
        $scope.upcoming_bookings_ids.push(item.id)
        $scope.upcoming_bookings_map[item.id] = item



  $scope.getUpcomingBookings = () =>
    $scope.notLoaded $scope
    params = {start_date: moment().format('YYYY-MM-DD')}
    params.per_page = @limit if @limit

    $scope.clientPromise.then ->
      MemberBookingService.query($scope.client, params).then (bookings) ->
        $scope.setLoaded $scope
        $scope.upcoming_bookings = bookings
        $scope.upcoming_bookings_ids = []
        $scope.upcoming_bookings_map = {}      
        for item in $scope.upcoming_bookings
          $scope.upcoming_bookings_ids.push(item.id)
          $scope.upcoming_bookings_map[item.id] = item
        $scope.setLoaded $scope
        $scope.setPageLoaded()

      , (err) ->
        $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.updateClient = (values) =>
    $scope.notLoaded $scope

    AdminClientService.update($scope.client).then (client) =>
      $scope.client = client
      $scope.setLoaded $scope
      AlertService.add("success", {msg: "Saved!"})
    , (err) ->
      $scope.setLoadedAndShowError($scope, err, 'Update failed')


  $scope.takeBooking = (template) =>    
    modalScope = $scope.$new(true)
    modalScope.company_id = $scope.bb.company_id
    modalScope.widget_settings = $scope.bb.widget_settings
    if $scope.bb.widget_routes?
      modalScope.widget_routes = $scope.bb.widget_routes
    unless modalScope.widget_settings.item_defaults?
      modalScope.widget_settings.item_defaults = {}
      
    modalScope.client = $scope.client
    modalScope.widget_settings.member_id = $scope.client_id
    modalScope.widget_settings.company_id = $scope.bb.company_id
    modalScope.widget_settings.clear_member = false
    console.log modalScope.widget_settings
      
    modalInstance = $modal.open
      templateUrl: template,
      scope: modalScope,
      windowClass: "model-large"

    modalScope.$on "processDone", () =>
      modalInstance.close()
      
    