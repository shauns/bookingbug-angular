angular.module('BBQueue').controller 'bbQueueServers', ($scope, $log,
    AdminQueueService, ModalForm, AdminPersonService) ->

  $scope.loading = true

  $scope.getServers = () ->
    AdminPersonService.query({company: $scope.company}).then (people) ->
      $scope.all_people = people
      $scope.servers = []
      for person in $scope.all_people
        $scope.servers.push(person) if !person.queuing_disabled
      $scope.loading = false
    , (err) ->
      $log.error err.data
      $scope.loading = false


 
  $scope.setAttendance = (person, status) ->
    $scope.loading = true
    person.setAttendance(status).then (person) ->
      $scope.loading = false
    , (err) ->
      $log.error err.data
      $scope.loading = false

  # update all servers to make sure each one is shows as serving the right person
  $scope.$watch 'queuers', (newValue, oldValue) =>
    if $scope.queuers && $scope.servers
      shash = {}
      for server in $scope.servers
        console.log server
        server.serving = null
        shash[server.self] = server
      for queuer in $scope.queuers
        if queuer.$href('person') && shash[queuer.$href('person')] && queuer.position == 0 
          # currently being seen
          shash[queuer.$href('person')].serving = queuer


  $scope.serveQueuer = (person, queuer) ->
    queuer.serve(person).then () ->
