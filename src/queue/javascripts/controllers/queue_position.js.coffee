angular.module('BBQueue.Controllers').controller 'QueuePosition', (QueuerService, $interval, $scope, $rootScope) ->

	params =
		id: $scope.queuerId
		url: $scope.apiUrl

	now = moment.utc()

	QueuerService.query(params).then (queuer) ->
		$scope.queuer = queuer
		$scope.name = queuer.first_name
		$scope.position = queuer.position
		$scope.serviceName = queuer.service_name
		$scope.timeRemaining = $scope.queuer.due_time.diff(now, 'minutes')
	

	$interval(->
		$scope.timeRemaining--
	, 60000)
