
angular.module('BB.Directives').directive 'bbLogin', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'Login'


angular.module('BB.Controllers').controller 'Login', ($scope,  $rootScope, LoginService, $q, ValidatorService, BBModel, $location) ->
  $scope.controller = "public.controllers.Login"

  $scope.login_sso = (token, route) =>
    $rootScope.connection_started.then =>
      LoginService.ssoLogin({company_id: $scope.bb.company.id, root: $scope.bb.api_url}, {token: token}).then (member) =>
        $scope.showPage(route) if route
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.login_with_password = (email, password) =>
    LoginService.companyLogin($scope.bb.company, {}, {email: email, password: password}).then (member) =>
      member = new BBModel.Member.Member(member)
      $scope.member =  member
      $scope.success = true
    , (err) =>
      $scope.login_error = err

  $scope.showEmailPasswordReset = () =>
    $scope.showPage('email_reset_password')

  $scope.isLoggedIn = () =>
    LoginService.isLoggedIn()

  $scope.sendPasswordReset = (email) =>
    LoginService.sendPasswordReset($scope.bb.company, {email: email, custom: true}).then () =>
      $scope.email_sent = true
    , (err) =>
      $scope.error = err

  $scope.updatePassword = (new_password, confirm_new_password) =>
    auth_token = $scope.member.getOption('auth_token')
    if $scope.member && auth_token && new_password && confirm_new_password && (new_password == confirm_new_password)
      LoginService.updatePassword($rootScope.member, {auth_token: auth_token, new_password: new_password, confirm_new_password: confirm_new_password}).then (member) =>
        if member
          $scope.password_updated = true
          $scope.showPage('login')
      , (err) =>
        $scope.error = err
    else
      $scope.password_error = true