angular.module('BBQueue.Directives').directive 'bbQueueTable', () ->

  restrict: 'AE'
  replace: true
  controller: 'QueueTable'
  template: '<div ng-include="queue_template"></div>'


angular.module('BBQueue.Controllers').controller 'QueueTable', ($scope,
    $rootScope) ->


  $scope.queue_template = 'queue_table.html'