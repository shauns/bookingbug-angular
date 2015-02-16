angular.module('BBAdminEvents').directive 'eventGroupTable', (AdminCompanyService,
    AdminEventGroupService, $modal, $log, ModalForm) ->

  controller = ($scope) ->

    $scope.getEventGroups = () ->
      params =
        company: $scope.company
      AdminEventGroupService.query(params).then (event_groups) ->
        $scope.event_groups_models = event_groups
        $scope.event_groups = _.map event_groups, (event_group) ->
          _.pick event_group, 'id', 'name', 'mobile'

    $scope.newEventGroup = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Event Group'
        new_rel: 'new_event_group'
        post_rel: 'event_groups'
        success: (event_group) ->
          $scope.event_groups.push(event_group)

    $scope.delete = (id) ->
      event_group = _.find $scope.event_groups_models, (p) -> p.id == id
      event_group.$del('self').then () ->
        $scope.event_groups = _.reject $scope.event_groups, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete event_group"

    $scope.edit = (id) ->
      event_group = _.find $scope.event_groups_models, (p) -> p.id == id
      ModalForm.edit
        model: event_group
        title: 'Edit Event Group'

  link = (scope, element, attrs) ->
    if scope.company
      scope.getEventGroups()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getEventGroups()

  {
    controller: controller
    link: link
    templateUrl: 'event_group_table_main.html'
  }
