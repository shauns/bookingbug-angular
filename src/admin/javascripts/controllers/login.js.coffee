
angular.module('BBAdmin').directive 'bbAdminLogin', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'AdminLogin'
  templateUrl: 'login.html'


angular.module('BBAdmin').controller 'AdminLogin', ($scope,  $rootScope, AdminLoginService, $q) ->

  $scope.login_sso = (token, route) =>
    $rootScope.connection_started.then =>
      AdminLoginService.ssoLogin({company_id: $scope.bb.company.id, root: $scope.bb.api_url}, {token: token}).then (user) =>
        $scope.loggedInDef.resolve(user)

  $scope.login_with_password = (email, password) =>
    $rootScope.connection_started.then =>
      AdminLoginService.login({email: email, password: password, company_id: $scope.bb.company.id}, {}).then (user) =>
        $scope.loggedInDef.resolve(user)
        $scope.user = user

  $scope.login = () =>
    $rootScope.bb ||= {}
    if $scope.host
      $rootScope.bb.api_url = $scope.host
    AdminLoginService.login({email: $scope.email, password: $scope.password}, {}).then (user) =>
      console.log user
      $scope.loggedInDef.resolve(user)
      $scope.user = user
