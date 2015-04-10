angular.module('BBQueue.Services').factory 'AdminQueueService', ($q, $window, halClient, QueuerCollections, BBModel) ->

	query: (prms) ->
    if prms.date
      prms.start_date = prms.date
      prms.end_date = prms.date 
      
    deferred = $q.defer()
    existing = QueuerCollections.find(prms)
    if existing
      deferred.resolve(existing)
    else if prms.company
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
      href = url + "/api/v1/admin/{company_id}/queuers{?start_date,end_date,service_id,page,per_page}"
      uri = new $window.UriTemplate.parse(href).expand(prms || {})

      halClient.$get(uri, {}).then  (found) =>
        found.$get('queuers').then (items) =>
          sitems = []
          for item in items
            sitems.push(new BBModel.AdminQueuer(item))
          queuers = new $window.Collection.Queuer(found, sitems, prms)
          QueuerCollections.add(queuers)
          deferred.resolve(queuers)
      , (err) =>
        deferred.reject(err)

    deferred.promise