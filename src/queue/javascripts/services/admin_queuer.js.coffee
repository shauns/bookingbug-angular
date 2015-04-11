angular.module('BBQueue.Services').factory 'AdminQueuerService', ($q, $window, halClient, BBModel) ->

  query: (prms) ->
      
    deferred = $q.defer()
    if prms.company
      prms.company.$get('queuers').then (collection) ->
        collection.$get('queuers').then (queuers) ->
          models = (new BBModel.Admin.Queuer(q) for q in queuers)
          deferred.resolve(models)
        , (err) ->
          deferred.reject(err)
      , (err) ->
        deferred.reject(err)
    else      
      url = ""
      url = prms.url if prms.url
      href = url + "/api/v1/admin/{company_id}/queuers{?client_queue_id,page,per_page}"
      uri = new $window.UriTemplate.parse(href).expand(prms || {})

      halClient.$get(uri, {}).then  (found) =>
        found.$get('queuers').then (items) =>
          sitems = []
          for item in items
            sitems.push(new BBModel.AdminQueuer(item))
          deferred.resolve(queuers)
      , (err) =>
        deferred.reject(err)

    deferred.promise