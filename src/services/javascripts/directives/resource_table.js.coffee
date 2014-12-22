angular.module('BBAdminServices').directive 'resourceTable', (AdminCompanyService,
    AdminResourceService, $modal, $log, ModalForm) ->

  controller = ($scope) ->

    $scope.getResources = () ->
      params =
        company: $scope.company
      AdminResourceService.query(params).then (resources) ->
        $scope.resources_models = resources
        $scope.resources = _.map resources, (resource) ->
          _.pick resource, 'id', 'name', 'mobile'

    $scope.newResource = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Resource'
        new_rel: 'new_resource'
        post_rel: 'resources'
        success: (resource) ->
          $scope.resources.push(resource)

    $scope.delete = (id) ->
      resource = _.find $scope.resources_models, (p) -> p.id == id
      resource.$del('self').then () ->
        $scope.resources = _.reject $scope.resources, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete resource"

    $scope.edit = (id) ->
      resource = _.find $scope.resources_models, (p) -> p.id == id
      ModalForm.edit
        model: resource
        title: 'Edit Resource'

  link = (scope, element, attrs) ->
    if scope.company
      scope.getResources()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getResources()

  {
    controller: controller
    link: link
    templateUrl: 'resource_table_main.html'
  }
