
angular.module('BBAdmin.Directives').directive 'bbAdminLogin', ($http,
    $templateCache, $compile) ->

  restrict: 'AE'
  replace: true
  scope: {
    onSuccess: '='
    onCancel: '='
    onError: '='
    bb: '='
  }
  controller: 'AdminLogin'
  link: (scope, element, attrs) ->
    setTemplate = (template_path) ->
      $http.get(template_path, {cache: $templateCache}).success (response) ->
        contents = element.html(response).contents()
        $compile(contents)(scope)

    scope.pickCompany = () ->
      setTemplate('/angular/partials/admin/pick_company.html')

    setTemplate('/angular/partials/admin/login.html')

angular.module('BBAdmin.Controllers').controller 'AdminLogin', ($scope,
    $rootScope, AdminLoginService, $q, BBModel) ->

  $scope.login_sso = (token, route) ->
   $rootScope.connection_started.then ->
     params =
       company_id: $scope.bb.company.id
       root: $scope.bb.api_url
     AdminLoginService.ssoLogin(params, {token: token}).then (user) ->
        $scope.loggedInDef.resolve(user)

  $scope.login_with_password = (email, password) ->
    $rootScope.connection_started.then ->
      params =
        email: email
        password: password
        company_id: $scope.bb.company_id
      AdminLoginService.login(params, {}).then (user) ->
        $scope.loggedInDef.resolve(user)
        $scope.user = user

  $scope.passwordIsInvalid = () ->
    $scope.login_form.password.$dirty && $scope.login_form.password.$invalid

  $scope.emailIsInvalid = () ->
    $scope.login_form.email.$dirty && $scope.login_form.email.$invalid

  $scope.submit = () ->
    $scope.alert = ""
    if $scope.login_form.$valid
      $scope.$parent.notLoaded $scope
      params =
        email: $scope.email
        password: $scope.password
      AdminLoginService.login(params).then (user) ->
        if user.company_id?
          $scope.$parent.setLoaded $scope
          $scope.onSuccess()
        else
          user.getAdministratorsPromise().then (administrators) ->
            $scope.$parent.setLoaded $scope
            $scope.administrators = administrators
            $scope.pickCompany()
      , (err) ->
        $scope.$parent.setLoaded $scope
        $scope.alert = "Sorry, either your email or password was incorrect"

  $scope.selectedCompany = () ->
    $scope.alert = ""
    if $scope.pick_company_form.$valid
      params =
        email: $scope.email
        password: $scope.password
      $scope.selected_admin.$post('login', {}, params).then (login) ->
        $scope.selected_admin.getCompanyPromise().then (company) ->
          $scope.bb.company = company
          AdminLoginService.setLogin($scope.selected_admin)
          $scope.onSuccess(company)

