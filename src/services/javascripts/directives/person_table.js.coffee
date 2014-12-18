angular.module('BBAdminServices').directive 'personTable', (AdminCompanyService,
    AdminPersonService, $modal, $log, ModalForm) ->

  controller = ($scope) ->


    $scope.getPeople = () ->
      params =
        company: $scope.company
      AdminPersonService.query(params).then (people) ->
        $scope.people_models = people
        $scope.people = _.map people, (person) ->
          _.pick person, 'id', 'name', 'mobile'

    $scope.newPerson = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Person'
        new_rel: 'new_person'
        post_rel: 'people'
        success: (person) ->
          $scope.people.push(person)

    $scope.delete = (id) ->
      person = _.find $scope.people_models, (p) -> p.id == id
      person.$del('self').then () ->
        $scope.people = _.reject $scope.people, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete person"

    $scope.edit = (id) ->
      person = _.find $scope.people_models, (p) -> p.id == id
      ModalForm.edit
        model: person
        title: 'Edit Person'

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
