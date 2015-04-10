angular.module('BBQueue.Directives').directive 'bbQueuePosition', () ->

  restrict: 'AE'
  replace: true
  controller: 'QueuePosition'
  template_url: 'queue_position.html'


angular.module('BBQueue.Controllers').controller 'QueuePosition', ($scope,
    $rootScope) ->

  $scope.queue_template = 'queue_position.html'