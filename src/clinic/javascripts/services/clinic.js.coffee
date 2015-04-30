angular.module('BBClinic.Services').factory 'AdminClinicService',  ($q, BBModel) ->

  query: (params) ->
    company = params.company
    defer = $q.defer()

    company.$get('clinics').then (collection) ->
      collection.$get('clinics').then (clinics) ->
        models = (new BBModel.Admin.Clinic(s) for s in clinics)
        defer.resolve(models)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise

  create: (prms, clinic) ->
    company = prms.company
    deferred = $q.defer()
    company.$post('clinics', {}, clinic.getPostData()).then  (clinic) =>
      clinic = new BBModel.Admin.Clinic(clinic)
#      ClinicCollections.checkItems(clinic)
      deferred.resolve(clinic)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  delete: (clinic) ->
    deferred = $q.defer()
    clinic.$del('self').then  (clinic) =>
      clinic = new BBModel.Admin.Clinic(clinic)
      ClinicCollections.deleteItems(clinic)
      deferred.resolve(clinic)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  update: (clinic) ->
    deferred = $q.defer()
    clinic.$put('self', {}, clinic.getPostData()).then (c) =>
      clinic.updateModel(c)
      clinic.setTimes()
      deferred.resolve(clinic)
    , (err) =>
      deferred.reject(err)

    deferred.promise
