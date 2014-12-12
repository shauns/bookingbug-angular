angular.module('BBAdminTable').directive 'adminTable', (AdminLoginService,
    AdminAdministratorService, $modal, $log, $rootScope) ->

  newAdministratorForm = ($scope, $modalInstance, company) ->
    $scope.title = 'New Administrator'
    $scope.company = company
    $scope.company.$get('new_administrator').then (admin_schema) ->
      $scope.form = _.reject admin_schema.form, (x) -> x.type == 'submit'
      $scope.schema = admin_schema.schema
      $scope.admin = {}

    $scope.cancel = (event) ->
      event.preventDefault()
      event.stopPropagation()
      $modalInstance.dismiss('cancel')

    $scope.submit = (person_form) ->
      $scope.$broadcast('schemaFormValidate')
      $scope.company.$post('administrators', {}, $scope.admin).then (admin) ->
        $modalInstance.close(admin)
        $scope.$parent.people.push(admin)
      , (err) ->
        $modalInstance.close(admin)
        $log.error 'Failed to create admin'

  editAdministratorForm = ($scope, $modalInstance, admin) ->
    console.log admin
    $scope.title = 'Edit Administrator'
    $scope.admin = admin
    $scope.admin.$get('edit').then (admin_schema) ->
      $scope.form = _.reject admin_schema.form, (x) -> x.type == 'submit'
      $scope.schema = admin_schema.schema

    $scope.ok = () ->
      $modalInstance.close($scope.admin)

    $scope.cancel = () ->
      $modalInstance.dismiss('cancel')

  link = (scope, element, attrs) ->

    scope.newAdministrator = () ->
      $modal.open
        templateUrl: 'admin_form.html'
        controller: newAdministratorForm
        resolve:
          company: () -> scope.company

    scope.edit = (id) ->
      console.log 'id ', id
      admin = _.find scope.admin_models, (p) -> p.id == id
      console.log 'admin ', admin
      $modal.open
        templateUrl: 'admin_form.html'
        controller: editAdministratorForm
        resolve:
          admin: () -> admin

    $rootScope.bb ||= {}
    $rootScope.bb.api_url ||= attrs.apiUrl
    $rootScope.bb.api_url ||= "http://www.bookingbug.com"
    login_form =
      email: attrs.adminEmail
      password: attrs.adminPassword
    options =
      company_id: attrs.companyId
    AdminLoginService.login(login_form, options).then (user) ->
      user.$get('company').then (company) ->
        scope.company = company
        params =
          company: company
        AdminAdministratorService.query(params).then (administrators) ->
          scope.admin_models = administrators
          scope.administrators = _.map administrators, (administrator) ->
            _.pick administrator, 'id', 'name', 'email', 'role'

  {
    link: link
    templateUrl: 'admin_table_main.html'
  }
