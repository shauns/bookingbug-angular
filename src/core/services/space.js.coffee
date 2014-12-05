angular.module('BB.Services').factory "SpaceService", ['$q',  ($q, BBModel) ->
  query: (company) ->
    deferred = $q.defer()
    if !company.$has('spaces')
      deferred.reject("No spaces found")
    else
      company.$get('spaces').then (resource) =>
        resource.$get('spaces').then (items) =>
          spaces = []
          for i in items
            spaces.push(new BBModel.Space(i))
          deferred.resolve(spaces)
      , (err) =>
        deferred.reject(err)

    deferred.promise
]
