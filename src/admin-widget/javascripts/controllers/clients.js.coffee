'use strict';

angular.module('BBAdminBooking').directive 'bbAdminBookingClients', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'adminBookingClients'


angular.module('BBAdminBooking').controller 'adminBookingClients', ($scope,  $rootScope, $q, AdminClientService, ClientDetailsService, AlertService, ClientService, ValidatorService) ->
  
  $scope.validator = ValidatorService
  $scope.clientDef = $q.defer()
  $scope.clientPromise = $scope.clientDef.promise 
  $scope.per_page = 20
  $scope.total_entries = 0
  $scope.clients = []
  $scope.searchClients = false
  $scope.newClient = false
  $scope.no_clients = false
  $scope.search_error = false


#  $rootScope.connection_started.then ->
#    $scope.notLoaded $scope
#    AdminClientService.query({company_id:$scope.bb.company_id}).then (clients) =>
#      $scope.clients = clients
#      $scope.clientDef.resolve(clients)
#      $scope.setLoaded $scope
#    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
#    ClientDetailsService.query($scope.bb.company).then (details) =>
#      $scope.client_details = details
#      $scope.setLoaded $scope


  $scope.showSearch = () =>
    $scope.searchClients = true
    $scope.newClient = false
  

  $scope.showClientForm = () =>
    $scope.search_error = false
    $scope.no_clients = false
    $scope.searchClients = false
    $scope.newClient = true
  

  $scope.selectClient = (client) =>
    $scope.search_error = false
    $scope.no_clients = false
    $scope.setClient(client)
    $scope.client.setValid(true)
    $scope.decideNextPage()

  $scope.searchByEmail = () =>
    $scope.searchName = false
    $scope.searchEmail = true
  
  $scope.searchByName = () =>
    $scope.searchEmail = false
    $scope.searchName = true

  $scope.checkSearch = (search) =>
    if search.length >= 3
      $scope.search_error = false
      return true
    else
      $scope.search_error = true
      return false


  $scope.createClient = (client_form) =>
    $scope.notLoaded $scope

    # we need to validate teh client information has been correctly entered here
    if $scope.bb && $scope.bb.parent_client
      $scope.client.parent_client_id = $scope.bb.parent_client.id
    $scope.client.setClientDetails($scope.client_details) if $scope.client_details

    ClientService.create_or_update($scope.bb.company, $scope.client).then (client) =>
      $scope.setLoaded $scope
      $scope.selectClient(client)
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
   

  $scope.getClients = (currentPage, filterBy, filterByFields, orderBy, orderByReverse) ->
    AlertService.clear()
    $scope.no_clients = false
    $scope.search_error = false
    clientDef = $q.defer()
    params = {company: $scope.bb.company, per_page: $scope.per_page, filter_by: filterBy, filter_by_fields: filterByFields, order_by: orderBy, order_by_reverse: orderByReverse}
    params.page = currentPage+1 if currentPage
    $rootScope.connection_started.then ->
      $scope.notLoaded $scope
      $rootScope.bb.api_url = $scope.bb.api_url if !$rootScope.bb.api_url && $scope.bb.api_url
      AdminClientService.query(params).then (clients) =>
        $scope.clients = clients.items
        $scope.setLoaded $scope
        $scope.setPageLoaded()
        $scope.total_entries = clients.total_entries
        clientDef.resolve(clients.items)
      , (err) ->  
        $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
        clientDef.reject(err)
    true
  

  $scope.edit = (item) ->
    console.log item