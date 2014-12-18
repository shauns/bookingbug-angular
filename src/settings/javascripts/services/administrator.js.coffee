angular.module('BBAdmin.Services').factory 'AdminAdministratorService', ($q, BBModel) ->

  query: (params) ->
    company = params.company
    defer = $q.defer()
    company.$get('administrators').then (collection) ->
      collection.$get('administrators').then (administrators) ->
        models = (new BBModel.Admin.Administrator(a) for a in administrators)
        defer.resolve(models)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise

