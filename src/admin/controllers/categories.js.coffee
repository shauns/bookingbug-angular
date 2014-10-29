

angular.module('BBAdmin.Controllers').controller 'CategoryList', ($scope,  $location, CategoryService, $rootScope) ->

  $rootScope.connection_started.then =>
    $scope.categories = CategoryService.query($scope.bb.company)

    $scope.categories.then (items) =>


  $scope.$watch 'selectedCategory', (newValue, oldValue) =>
    $rootScope.category = newValue

    items = $('.inline_time').each (idx, e) -> 
      angular.element(e).scope().clear() 

  $scope.$on "Refresh_Cat", (event, message) =>
    $scope.$apply()


