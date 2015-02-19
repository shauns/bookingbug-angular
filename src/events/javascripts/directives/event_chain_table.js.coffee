angular.module('BBAdminEvents').directive 'eventChainTable', (AdminCompanyService,
    AdminEventChainService, $modal, $log, ModalForm, $timeout) ->

  controller = ($scope) ->

    $scope.fields = ['id', 'name', 'description']

    $scope.getEventChains = () ->
      params =
        company: $scope.company
      AdminEventChainService.query(params).then (event_chains) ->
        $scope.event_chains = event_chains

    $scope.newEventChain = () ->
      ModalForm.new
        company: $scope.company
        title: 'New Event Chain'
        new_rel: 'new_event_chain'
        post_rel: 'event_chains'
        success: (event_chain) ->
          $scope.event_chains.push(event_chain)

    $scope.delete = (id) ->
      event_chain = _.find $scope.event_chains, (x) -> x.id == id
      event_chain.$del('self').then () ->
        $scope.event_chains = _.reject $scope.event_chains, (x) -> x.id == id
      , (err) ->
        $log.error "Failed to delete event_chain"

    editSuccess = (updated) ->
      updated.$flush('events')
      $scope.event_chains = _.map $scope.event_chains, (event_chain) ->
        if event_chain.id == updated.id
          updated
        else
          event_chain

    $scope.edit = (id) ->
      event_chain = _.find $scope.event_chains, (x) -> x.id == id
      event_chain.$get('events').then (collection) ->
        collection.$get('events').then (events) ->
          event_chain.events = events
          ModalForm.edit
            model: event_chain
            title: 'Edit Event Chain'
            success: editSuccess

  link = (scope, element, attrs) ->
    if scope.company
      scope.getEventChains()
    else
      AdminCompanyService.query(attrs).then (company) ->
        scope.company = company
        scope.getEventChains()

  {
    controller: controller
    link: link
    templateUrl: 'event_chain_table_main.html'
  }
