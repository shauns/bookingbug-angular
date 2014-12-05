angular.module('BB.Services').factory "EventGroupService",  ($q, BBModel) ->
  query: (company, params) ->
    deferred = $q.defer()
    if !company.$has('event_groups')
      deferred.reject("company does not have event_groups")
    else
      company.$get('event_groups', params).then (resource) =>
        resource.$get('event_groups', params).then (event_groups) =>
          event_groups = for event_group in event_groups
            new BBModel.EventGroup(event_group)
          deferred.resolve(event_groups)
      , (err) =>
        deferred.reject(err)
    deferred.promise
