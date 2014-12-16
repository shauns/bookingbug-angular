angular.module('BBPersonTable').directive 'personTable', (AdminCompanyService,
    AdminPersonService, $modal, $log) ->

  newPersonForm = ($scope, $modalInstance, company) ->
    $scope.title = 'New Person'
    $scope.company = company
    $scope.company.$get('new_person').then (person_schema) ->
      $scope.form = _.reject person_schema.form, (x) -> x.type == 'submit'
      $scope.schema = person_schema.schema
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

  controller = ($scope) ->

    $scope.getPeople = () ->
      params =
        company: $scope.company
      AdminPersonService.query(params).then (people) ->
        $scope.people_models = people
        $scope.people = _.map people, (person) ->
          _.pick person, 'id', 'name', 'mobile'

    $scope.newPerson = () ->
      $modal.open
        templateUrl: 'person_form.html'
        controller: newPersonForm
        resolve:
          company: () -> $scope.company

    $scope.delete = (id) ->
      person = _.find $scope.people_models, (p) -> p.id == id
      person.$del('self').then () ->
        $scope.people = _.reject $scope.people, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete person"

    $scope.edit = (id) ->
      person = _.find $scope.people_models, (p) -> p.id == id
      $modal.open
        templateUrl: 'person_form.html'
        controller: editPersonForm
        resolve:
          person: () -> person

  link = (scope, element, attrs) ->
    if scope.company
      scope.getPeople()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getPeople()

  {
    controller: controller
    link: link
    templateUrl: 'person_table_main.html'
  }
