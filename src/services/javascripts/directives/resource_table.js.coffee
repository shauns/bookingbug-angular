angular.module('BBAdminServices').directive 'resourceTable', (AdminCompanyService,
    AdminResourceService, $modal, $log, ModalForm) ->

  controller = ($scope) ->

    $scope.fields = ['id','name']

    $scope.getResources = () ->
      params =
        company: $scope.company
      AdminResourceService.query(params).then (resources) ->
        $scope.resources = resources

    $scope.newResource = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Resource'
        new_rel: 'new_resource'
        post_rel: 'resources'
        size: 'lg'
        success: (resource) ->
          $scope.resources.push(resource)

    $scope.delete = (resource) ->
      resource.$del('self').then () ->
        $scope.resources = _.reject $scope.resources, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete resource"

    $scope.edit = (resource) ->
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
