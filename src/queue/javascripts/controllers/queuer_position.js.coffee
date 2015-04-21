angular.module('BBQueue.Controllers').controller('QueuerPosition', ["QueuerService", "$scope", "$pusher", "QueryStringService", (QueuerService, $scope, $pusher, QueryStringService) ->

	params =
		id: QueryStringService('id')
		url: $scope.apiUrl

	QueuerService.query(params).then (queuer) ->
		$scope.queuer =
			name: queuer.first_name,
			position: queuer.position,
			due_time: queuer.due.valueOf(),
			serviceName: queuer.service_name

	# client = new Pusher("c8d8cea659cc46060608")
	# pusher = $pusher(client)
	# channel = pusher.subscribe('mobile-queue-#{$scope.queuer.space_id}')
])

