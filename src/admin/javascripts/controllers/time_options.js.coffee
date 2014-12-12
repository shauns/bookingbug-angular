




angular.module('BBAdmin.Controllers').controller 'TimeOptions', ($scope,  $location, $rootScope, AdminResourceService, AdminPersonService) ->

  AdminResourceService.query({company: $scope.bb.company}).then (resources) -> $scope.resources = resources

  AdminPersonService.query({company: $scope.bb.company}).then (people) -> $scope.people = people

  $scope.block = ->
    if $scope.person
      AdminPersonService.block($scope.bb.company, $scope.person, {start_time: $scope.start_time, end_time: $scope.end_time})
    $scope.ok()



