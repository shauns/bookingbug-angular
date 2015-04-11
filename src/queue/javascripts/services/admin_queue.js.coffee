angular.module('BBQueue.Services').factory 'AdminQueueService', ($q, $window, halClient, BBModel) ->

  query: (prms) ->
      
    deferred = $q.defer()
    if prms.company
      prms.company.$get('client_queues').then (collection) ->
        collection.$get('client_queues').then (client_queues) ->
          models = (new BBModel.Admin.Queue(q) for q in client_queues)
          deferred.resolve(models)
        , (err) ->
          deferred.reject(err)
      , (err) ->
        deferred.reject(err)
    else      
      url = ""
      url = prms.url if prms.url
      href = url + "/api/v1/admin/{company_id}/client_queues{?client_queue_id}"
      uri = new $window.UriTemplate.parse(href).expand(prms || {})

      halClient.$get(uri, {}).then  (found) =>
        found.$get('client_queues').then (items) =>
          sitems = []
          for item in items
            sitems.push(new BBModel.AdminQueue(item))
          deferred.resolve(client_queues)
      , (err) =>
        deferred.reject(err)

    deferred.promise

