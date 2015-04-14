angular.module('BBQueue.Controllers').controller 'QueuePosition', (QueuerService, $scope,
    $rootScope) ->

  params =
  	id: $scope.queuerId
  	url: $scope.apiUrl

  QueuerService.query(params).then (queuer) ->
  	$scope.name = queuer.first_name
  	$scope.position = queuer.position
  	$scope.endTime = queuer.due_time.getTime()
  	
