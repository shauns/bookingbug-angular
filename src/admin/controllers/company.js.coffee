
angular.module('BBAdmin.Controllers').controller 'CompanyList', ($scope,  $rootScope, $location) ->
  $scope.selectedCategory = null;

  $rootScope.connection_started.then =>
    date = moment();
    $scope.current_date = date
    $scope.companies = $scope.bb.company.companies;
    if !$scope.companies || $scope.companies.length == 0
      $scope.companies = [$scope.bb.company]
    $scope.dates = []
    end = moment(date).add('days',21)
    $scope.end_date = end
    d = moment(date)
    while d.isBefore(end) 
      $scope.dates.push(d.clone())
      d.add('days',1)

  $scope.selectCompany = (item) ->
    window.location = "/view/dashboard/pick_company/" + item.id;
#    $location.path(route) 

  $scope.advance_date = (num) ->
    date = $scope.current_date.add('days',num)
    $scope.end_date =  moment(date).add('days',21)
    $scope.current_date = moment(date)
    $scope.dates = []
    d = date.clone()
    while d.isBefore($scope.end_date)
      $scope.dates.push(d.clone())
      d.add('days',1)

  $scope.$on "Refresh_Comp", (event, message)->
      $scope.$apply()

