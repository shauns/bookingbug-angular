angular.module('BBAdminEvents').factory 'AdminEventChainService',  ($q, BBModel) ->

  query: (params) ->
    company = params.company
    defer = $q.defer()
    company.$get('event_chains').then (collection) ->
      collection.$get('event_chains').then (event_chains) ->
        models = (new BBModel.Admin.EventChain(e) for e in event_chains)
        defer.resolve(models)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise

