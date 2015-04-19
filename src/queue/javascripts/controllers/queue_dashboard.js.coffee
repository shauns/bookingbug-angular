angular.module('BBQueue').controller 'bbQueueDashboardController', ($scope, $log,
    AdminServiceService, ModalForm, BBModel) ->

  $scope.loading = true
  $scope.new_queuer = {}

  $scope.getSetup = () ->
    params =
      company: $scope.company
    AdminServiceService.query(params).then (services) ->
      $scope.services = services
      $scope.other = []
      for service in services
        $scope.other.push(service) if !service.queuing_disabled
      $scope.loading = false
    , (err) ->
      $log.error err.data
      $scope.loading = false


  $scope.overTrash = (event, ui, set) ->
    $scope.$apply () ->
      $scope.trash_hover = set

  $scope.dropTrash = (event, ui) ->
    console.log "drop", $scope.selected_queuer
    $scope.$apply () ->
      $scope.trash_hover = false
      $scope.selected_queuer.$del().then (queuer) ->
        selectQueuer(null)



  $scope.selectQueuer = (queuer) ->
    if $scope.selected_queuer && $scope.selected_queuer == queuer
      $scope.selected_queuer = null
    else
      $scope.selected_queuer = queuer    


  $scope.addQueuer = (service) ->
    $scope.new_queuer.service_id = service.id
    service.$post('add_queuer', {}, $scope.new_queuer).then (queuer) ->
      $scope.queuers.push(new BBModel.Admin.Queuer(queuer))
