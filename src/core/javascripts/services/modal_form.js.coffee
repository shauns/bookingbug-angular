angular.module('BB.Services').factory 'ModalForm', ($modal, $log) ->

  newForm = ($scope, $modalInstance, company, title, new_rel, post_rel,
      success, fail) ->

    $scope.title = title
    $scope.company = company
    $scope.company.$get(new_rel).then (schema) ->
      $scope.form = _.reject schema.form, (x) -> x.type == 'submit'
      $scope.schema = schema.schema
      $scope.form_model = {}

    $scope.submit = (form) ->
      $scope.$broadcast('schemaFormValidate')
      $scope.company.$post(post_rel, {}, $scope.form_model).then (model) ->
        $modalInstance.close(model)
        success(model) if success
      , (err) ->
        $modalInstance.close(err)
        $log.error 'Failed to create'
        fail(err) if fail

    $scope.cancel = (event) ->
      event.preventDefault()
      event.stopPropagation()
      $modalInstance.dismiss('cancel')

  editForm = ($scope, $modalInstance, model, title, success, fail) ->
    $scope.title = title
    $scope.model = model
    $scope.model.$get('edit').then (schema) ->
      $scope.form = _.reject schema.form, (x) -> x.type == 'submit'
      $scope.schema = schema.schema
      $scope.form_model = $scope.model

    $scope.submit = (form) ->
      $scope.$broadcast('schemaFormValidate')
      $scope.model.$put('self', {}, $scope.form_model).then (model) ->
        $modalInstance.close(model)
        success() if success
      , (err) ->
        $modalInstance.close(err)
        $log.error 'Failed to create'
        fail() if fail

    $scope.cancel = (event) ->
      event.preventDefault()
      event.stopPropagation()
      $modalInstance.dismiss('cancel')

  new: (config) ->
    $modal.open
      templateUrl: 'modal_form.html'
      controller: newForm
      size: config.size
      resolve:
        company: () -> config.company
        title: () -> config.title
        new_rel: () -> config.new_rel
        post_rel: () -> config.post_rel
        success: () -> config.success
        fail: () -> config.fail

  edit: (config) ->
    $modal.open
      templateUrl: 'modal_form.html'
      controller: editForm
      size: config.size
      resolve:
        model: () -> config.model
        title: () -> config.title
        success: () -> config.success
        fail: () -> config.fail

