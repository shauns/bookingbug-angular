angular.module('BBQueue.Controllers').controller 'QueuePosition', (QueuerService, $interval, $scope, $rootScope) ->

	$scope.getQueuer = () ->
		params =
			id: $scope.queuerId
			url: $scope.apiUrl

		QueuerService.query(params).then (queuer) ->
			$scope.queuer =
				name: queuer.first_name,
				position: queuer.position,
				due_time: queuer.due_time.valueOf(),
				serviceName: queuer.service_name
