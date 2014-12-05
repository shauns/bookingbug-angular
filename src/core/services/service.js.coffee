
angular.module('BB.Services').factory "ServiceService", ($q, BBModel) ->
  query: (company) ->
    deferred = $q.defer()
    if !company.$has('services')
      deferred.reject("No services found")
    else
      company.$get('services').then (resource) =>
        resource.$get('services').then (items) =>
          services = []
          for i in items
            services.push(new BBModel.Service(i))
          deferred.resolve(services)
      , (err) =>
        deferred.reject(err)

    deferred.promise
