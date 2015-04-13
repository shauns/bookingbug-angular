angular.module('BBQueue.Controllers').controller 'QueuePosition', (QueuerService, $scope,
    $rootScope) ->

  params =
  	id: $scope.queuerId
  	url: $scope.apiUrl

  QueuerService.query(params).then (queuer) ->
  	$scope.name = queuer.first_name
  	$scope.position = queuer.position
  	
  $scope.time_remaining = 1451628000000

  