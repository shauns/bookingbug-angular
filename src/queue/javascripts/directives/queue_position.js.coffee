angular.module('BBQueue.Directives').directive 'bbQueuePosition', () ->

	restrict: 'AE'
	replace: true
	controller: 'QueuePosition'
	templateUrl: 'queue_position.html'
	scope:
		queuerId: '='
		apiUrl: '@'
	link: ($scope, element, attribute) ->
		$scope.getQueuer()
