angular.module('BBQueue.Controllers').controller 'QueuePosition', (QueuerService, $interval, $scope, $rootScope) ->

	params =
		id: $scope.queuerId
		url: $scope.apiUrl

	QueuerService.query(params).then (queuer) ->
		$scope.queuer = queuer
		$scope.name = queuer.first_name
		$scope.position = queuer.position
		$scope.serviceName = queuer.service_name
		$scope.timeRemaining = $scope.queuer.due_time.diff(moment.utc(), 'minutes')
	
	$interval(->
		$scope.timeRemaining = $scope.queuer.due_time.diff(moment.utc(), 'minutes')
	, 60000)
