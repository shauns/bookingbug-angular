angular.module('BBScheduleTable').directive 'scheduleTable', (AdminCompanyService,
    AdminScheduleService, $modal, $log, ModalForm) ->

  controller = ($scope) ->

    $scope.getSchedules = () ->
      params =
        company: $scope.company
      AdminScheduleService.query(params).then (schedule) ->
        $scope.schedules_models = schedules
        $scope.schedules = _.map schedules, (schedule) ->
          _.pick schedule, 'id', 'name', 'mobile'

    $scope.newSchedule = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Schedule'
        new_rel: 'new_schedule'
        post_rel: 'schedules'
        success: (schedule) ->
          $scope.schedules.push(schedule)

    $scope.delete = (id) ->
      schedule = _.find $scope.schedules_models, (p) -> p.id == id
      schedule.$del('self').then () ->
        $scope.schedules = _.reject $scope.schedules, (p) -> p.id == id
      , (err) ->
        $log.error "Failed to delete schedule"

    $scope.edit = (id) ->
      schedule = _.find $scope.schedules_models, (p) -> p.id == id
      ModalForm.edit
        model: schedule
        title: 'Edit Schedule'

  link = (scope, element, attrs) ->
    if scope.company
      scope.getSchedules()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getSchedules()

  {
    controller: controller
    link: link
    templateUrl: 'schedule_table_main.html'
  }
