
angular.module('BB.Directives').directive 'bbLogin', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'ServiceList'


angular.module('BB.Controllers').controller 'Login', ($scope,  $rootScope, LoginService, $q, ValidatorService, BBModel, $location) ->
  $scope.controller = "public.controllers.Login"

  $scope.login_sso = (token, route) =>
    $rootScope.connection_started.then =>
      LoginService.ssoLogin({company_id: $scope.bb.company.id, root: $scope.bb.api_url}, {token: token}).then (member) =>
        $scope.showPage(route) if route
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.login_with_password = (email, password) =>
    LoginService.companyLogin($scope.bb.company, {}, {email: email, password: password})