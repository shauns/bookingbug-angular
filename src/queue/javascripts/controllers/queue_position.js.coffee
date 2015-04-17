angular.module('BBQueue.Controllers').controller('QueuePosition', ["QueuerService", "$scope", "$rootScope", (QueuerService, $scope, $rootScope) ->

	params =
		id: $scope.queuerId
		url: $scope.apiUrl

	QueuerService.query(params).then (queuer) ->
		$scope.queuer =
			name: queuer.first_name,
			position: queuer.position,
			due_time: queuer.due_time.valueOf(),
			serviceName: queuer.service_name
])

