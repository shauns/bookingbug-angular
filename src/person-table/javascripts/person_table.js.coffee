angular.module('BBPersonTable').directive 'personTable', (AdminLoginService,
    AdminPersonService, $modal, $log, $rootScope) ->

  newPersonForm = ($scope, $modalInstance, company) ->
    $scope.title = 'New Person'
    $scope.company = company
    $scope.company.$get('new_person').then (person_schema) ->
      console.log 'new person schema ', person_schema
      $scope.form = _.reject person_schema.form, (x) -> x.type == 'submit'
      console.log $scope.form
      $scope.schema = person_schema.schema
      console.log $scope.schema
      $scope.person = {}

    $scope.cancel = (event) ->
      event.preventDefault()
      event.stopPropagation()
      $modalInstance.dismiss('cancel')

    $scope.submit = (person_form) ->
      $scope.$broadcast('schemaFormValidate')
      $scope.company.$post('people', {}, $scope.person).then (person) ->
        $modalInstance.close(person)
        $scope.$parent.people.push(person)
      , (err) ->
        $modalInstance.close(person)
        $log.error 'Failed to create person'

  editPersonForm = ($scope, $modalInstance, person) ->
    $scope.title = 'Edit Person'
    $scope.ok = () ->
      $modalInstance.close($scope.person)

    $scope.cancel = () ->
      $modalInstance.dismiss('cancel')

  link = (scope, element, attrs) ->

    scope.newPerson = () ->
      $modal.open
        templateUrl: 'person_form.html'
        controller: newPersonForm
        resolve:
          company: () -> scope.company

    scope.delete = (id) ->
      person = _.find scope.people_models, (p) -> p.id == id
      person.$del('self').then () ->
        scope.people = _.reject scope.people, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete person"

    scope.edit = (id) ->
      person = _.find scope.people_models, (p) -> p.id == id
      $modal.open
        templateUrl: 'person_form.html'
        controller: editPersonForm
        resolve:
          person: () -> person

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
        AdminPersonService.query(params).then (people) ->
          scope.people_models = people
          scope.people = _.map people, (person) ->
            _.pick person, 'id', 'name', 'mobile'

  {
    link: link
    templateUrl: 'main.html'
  }
