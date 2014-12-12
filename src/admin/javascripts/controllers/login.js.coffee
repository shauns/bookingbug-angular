
angular.module('BBAdmin.Directives').directive 'bbAdminLogin', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'AdminLogin'


angular.module('BBAdmin.Controllers').controller 'AdminLogin', ($scope,  $rootScope, AdminLoginService, $q) ->

  $scope.login_sso = (token, route) =>
    $rootScope.connection_started.then =>
      AdminLoginService.ssoLogin({company_id: $scope.bb.company.id, root: $scope.bb.api_url}, {token: token}).then (user) =>
        $scope.loggedInDef.resolve(user)

  $scope.login_with_password = (email, password) =>
    $rootScope.connection_started.then =>
      AdminLoginService.login({email: email, password: password, company_id: $scope.bb.company.id}, {}).then (user) =>
        $scope.loggedInDef.resolve(user)
        $scope.user = user
