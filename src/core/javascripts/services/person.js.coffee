
angular.module('BB.Services').factory "PersonService", ($q, BBModel) ->
  query: (company) ->
    deferred = $q.defer()
    
    if !company.$has('people')
      deferred.reject("No people found")
    else
      company.$get('people').then (resource) =>
        resource.$get('people').then (items) =>
          people = []
          for i in items
            people.push(new BBModel.Person(i))
          deferred.resolve(people)
      , (err) =>
        deferred.reject(err)

    deferred.promise
