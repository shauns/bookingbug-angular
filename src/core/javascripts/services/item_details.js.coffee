
angular.module('BB.Services').factory "ItemDetailsService",  ($q, BBModel) ->
  query: (prms) ->
    deferred = $q.defer()
    if prms.cItem.service
      if !prms.cItem.service.$has('questions')
        deferred.resolve(new BBModel.ItemDetails())
      else prms.cItem.service.$get('questions').then (details) =>
        deferred.resolve(new BBModel.ItemDetails(details))
      , (err) =>
        deferred.reject(err)
    else if prms.cItem.event_chain
      if !prms.cItem.event_chain.$has('questions')
        deferred.resolve(new BBModel.ItemDetails())
      else prms.cItem.event_chain.$get('questions').then (details) =>
        deferred.resolve(new BBModel.ItemDetails(details))
      , (err) =>
        deferred.reject(err)
    else if prms.cItem.deal
      if !prms.cItem.deal.$has('questions')
        deferred.resolve(new BBModel.ItemDetails())
      else prms.cItem.deal.$get('questions').then (details) =>
        deferred.resolve(new BBModel.ItemDetails(details))
      , (err) =>
        deferred.reject(err)
    else
      deferred.reject("No service link found")
    deferred.promise
