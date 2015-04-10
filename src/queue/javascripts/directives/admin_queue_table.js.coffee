angular.module('BBQueue').directive 'bbAdminQueueTable', ($modal, $log, $rootScope,
    AdminQueueService, AdminCompanyService, $compile, $templateCache, ModalForm, BBModel) ->

  controller = ($scope, $modal) ->

    $scope.loading = true
    $scope.fields ||= ['ticket_number', 'name']

    if !$scope.company
      params = {}
      AdminCompanyService.query(params).then (company) ->
        $scope.company = company
      , (err) ->
        $log.error err.data
        $scope.loading = false

    $scope.$watch 'company', (company) ->
      getQueuers(company) if company?

    getQueuers = (company) ->
      params =
        company: company
        start_date: moment().format('YYYY-MM-DD')
      
      AdminQueueService.query(params).then (queuers) ->
        $scope.queuer_models = queuers
        $scope.queuers = _.map queuers, (queuers) ->
          _.pick queuers, 'ticket_number', 'name'
        $scope.loading = false
      , (err) ->
        $log.error err.data
        $scope.loading = false

  link = (scope, element, attrs) ->
    $rootScope.bb ||= {}
    $rootScope.bb.api_url ||= scope.apiUrl
    $rootScope.bb.api_url ||= "http://www.bookingbug.com"

  {
    link: link
    controller: controller
    templateUrl: 'queuer_table.html'
    scope:
      apiUrl: '@'
      fields: '=?'
      member: '='
  }