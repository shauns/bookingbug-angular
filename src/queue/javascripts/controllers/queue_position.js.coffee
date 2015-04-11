angular.module('BBQueue.Controllers').controller 'QueuePosition', ($scope,
    $rootScope) ->

  $scope.queue_position_template = 'queue_position.html'

  $scope.name = "Adam" #get member.name
  $scope.position = "321" #get queue.position
  $scope.time_remaining = humanizeDuration(1451628000000, { units: ["minutes"] })