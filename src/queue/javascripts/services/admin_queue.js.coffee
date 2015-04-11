angular.module('BBQueue.Services').factory 'AdminQueueService', ($q, $window,
    halClient, QueuerCollections, BBModel) ->

  query: (params) ->
    defer = $q.defer()
    params.company.$get('queuers').then (collection) ->
      collection.$get('queuers').then (queuers) ->
        models = (new BBModel.Admin.Queuer(q) for q in queuers)
        defer.resolve(models)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise
