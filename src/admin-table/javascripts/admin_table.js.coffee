angular.module('BBAdminTable').directive 'adminTable', (AdminCompanyService,
    AdminAdministratorService, $modal, $log) ->

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

  controller = ($scope) ->

    $scope.getAdministrators = () ->
      params =
        company: $scope.company
      AdminAdministratorService.query(params).then (administrators) ->
        $scope.admin_models = administrators
        $scope.administrators = _.map administrators, (administrator) ->
          _.pick administrator, 'id', 'name', 'email', 'role'

    $scope.newAdministrator = () ->
      $modal.open
        templateUrl: 'admin_form.html'
        controller: newAdministratorForm
        resolve:
          company: () -> $scope.company

    $scope.edit = (id) ->
      admin = _.find $scope.admin_models, (p) -> p.id == id
      $modal.open
        templateUrl: 'admin_form.html'
        controller: editAdministratorForm
        resolve:
          admin: () -> admin


  link = (scope, element, attrs) ->
    if scope.company
      scope.getAdministrators()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getAdministrators()

  {
    controller: controller
    link: link
    templateUrl: 'admin_table_main.html'
  }
