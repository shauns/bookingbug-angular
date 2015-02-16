angular.module('BBAdminEvents').factory 'AdminEventGroupService',  ($q, BBModel) ->

  query: (params) ->
    company = params.company
    defer = $q.defer()
    company.$get('event_groups').then (collection) ->
      collection.$get('event_groups').then (event_groups) ->
        models = (new BBModel.Admin.EventGroup(e) for e in event_groups)
        defer.resolve(models)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise



