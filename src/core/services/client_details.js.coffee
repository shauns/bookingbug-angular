
angular.module('BB.Services').factory "ClientDetailsService", ($q, BBModel) ->
  query: (company) ->
    deferred = $q.defer()
    if !company.$has('client_details')
      deferred.reject("No client_details found")
    else
      company.$get('client_details').then (details) =>
        deferred.resolve(new BBModel.ClientDetails(details))
      , (err) =>
        deferred.reject(err)
    deferred.promise
