'use strict';




angular.module('BBAdmin.Directives').directive 'bbAdminClients', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'AdminClients'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'AdminClients', ($scope,  $rootScope, $q, AdminClientService, ClientDetailsService, AlertService) ->

  $scope.clientDef = $q.defer()
  $scope.clientPromise = $scope.clientDef.promise 
  $scope.per_page = 15
  $scope.total_entries = 0
  $scope.clients = []

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


  $scope.getClients = (currentPage, filterBy, filterByFields, orderBy, orderByReverse) ->
    console.log currentPage, filterBy, filterByFields, orderBy, orderByReverse
    clientDef = $q.defer()

    $rootScope.connection_started.then ->
      $scope.notLoaded $scope
      AdminClientService.query({company_id:$scope.bb.company_id, per_page: $scope.per_page, page: currentPage+1, filter_by: filterBy, filter_by_fields: filterByFields, order_by: orderBy, order_by_reverse: orderByReverse    }).then (clients) =>
        $scope.clients = clients.items
        $scope.setLoaded $scope
        $scope.setPageLoaded()
        $scope.total_entries = clients.total_entries
        console.log ($scope.clients)
        clientDef.resolve(clients.items)
      , (err) ->  
        clientDef.reject(err)
        $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    true

  $scope.edit = (item) ->
    console.log item