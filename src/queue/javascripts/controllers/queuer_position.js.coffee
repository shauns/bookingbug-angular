'use strict';

angular.module('BBQueue.Controllers').controller('QueuerPosition', ["QueuerService", "$scope", "$pusher", "QueryStringService", (QueuerService, $scope, $pusher, QueryStringService) ->

	params =
		id: QueryStringService('id')
		url: $scope.apiUrl

	QueuerService.query(params).then (queuer) ->
		$scope.queuer =
			name: queuer.first_name,
			position: queuer.position,
			dueTime: queuer.due.valueOf(),
			serviceName: queuer.service.name
			spaceId: queuer.space_id
			ticketNumber: queuer.ticket_number

	client = new Pusher("c8d8cea659cc46060608")
	pusher = $pusher(client)
	channel = pusher.subscribe("mobile-queue-#{$scope.spaceId}")
	channel.bind('notification', (data) ->
		$scope.queuer.dueTime = data.due.valueOf()
		$scope.queuer.ticketNumber = data.ticket_number
		$scope.queuer.position = data.position
	)
])

