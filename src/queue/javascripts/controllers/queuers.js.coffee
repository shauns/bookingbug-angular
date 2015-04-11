angular.module('BBQueue').controller 'bbQueuers', ($scope, $log,
    AdminQueuerService, ModalForm) ->

  $scope.loading = true

  $scope.getQueuers = () ->
    params =
      company: $scope.company
    AdminQueuerService.query(params).then (queuers) ->
      $scope.queuers = queuers
      $scope.loading = false
    , (err) ->
      $log.error err.data
      $scope.loading = false

  $scope.newQueuerModal = () ->
    ModalForm.new
      company: $scope.company
      title: 'New Queuer'
      new_rel: 'new_queuer'
      post_rel: 'queuers'
      success: (queuer) ->
        $scope.queuers.push(queuer)

