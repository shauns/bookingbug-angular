
angular.module('BB.Services').factory "ResourceService", ($q, BBModel) ->
  query: (company) ->
    deferred = $q.defer()
    if !company.$has('resources')
      deferred.reject("No resource found")
    else
      company.$get('resources').then (resource) =>
        resource.$get('resources').then (items) =>
          resources = []
          for i in items
            resources.push(new BBModel.Resource(i))
          deferred.resolve(resources)
      , (err) =>
        deferred.reject(err)

    deferred.promise
