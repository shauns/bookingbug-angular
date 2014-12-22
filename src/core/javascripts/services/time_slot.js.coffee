angular.module('BB.Services').factory 'TimeSlotService', ($q, BBModel) ->

  query: (params) ->
    defer = $q.defer()
    company = params.company
    company.$get('slots', params).then (collection) ->
      collection.$get('slots').then (slots) ->
        slots = (new BBModel.TimeSlot(s) for s in slots)
        defer.resolve(slots)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise

