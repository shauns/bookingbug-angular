

angular.module('BB.Services').factory "PurchaseTotalService", ($q, BBModel) ->
  query: (prms) ->
    deferred = $q.defer()
    if !prms.company.$has('total')
      deferred.reject("No Total link found")
    else
      prms.company.$get('total', {total_id: prms.total_id } ).then (total) =>
        deferred.resolve(new BBModel.PurchaseTotal(total))
      , (err) =>
        deferred.reject(err)
 
    deferred.promise
