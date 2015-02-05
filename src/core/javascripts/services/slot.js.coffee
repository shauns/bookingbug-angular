angular.module('BB.Services').factory "SlotService", ($q, BBModel) ->
  query: (company, params) ->
    deferred = $q.defer()
    if !company.$has('slots')
      deferred.resolve([])
    else
      if params.item
        params.resource_id = params.item.resource.id if params.item.resource
        params.person_id = params.item.person.id if params.item.person
      company.$get('slots', params).then (resource) =>
        resource.$get('slots', params).then (slots) =>
          slots = (new BBModel.Slot(slot) for slot in slots)
          deferred.resolve(slots)
      , (err) =>
        deferred.reject(err)
    deferred.promise

