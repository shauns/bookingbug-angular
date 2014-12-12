

angular.module('BBAdmin.Services').factory 'AdminResourceService',
($q, $window, halClient, SlotCollections, BBModel) ->

  query: (prms) ->
    if prms.company
      prms.company_id = prms.company.id
    url = ""
    url = prms.url if prms.url
    href = url + "/api/v1/admin/{company_id}/resources"

    uri = new $window.UriTemplate.parse(href).expand(prms || {})
    deferred = $q.defer()
    halClient.$get(uri, {}).then  (resource) =>
      resource.$get('resources').then (items) =>
        resources = []
        for i in items
          resources.push(new BBModel.Resource(i))
        deferred.resolve(resources)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  block: (company, resource, data) ->
    prms = {id:  resource.id, company_id: company.id}

    deferred = $q.defer()
    href = "/api/v1/admin/{company_id}/resource/{id}/block"
    uri = new $window.UriTemplate.parse(href).expand(prms || {})

    halClient.$put(uri, {}, data).then  (slot) =>
      slot = new BBModel.Admin.Slot(slot)
      SlotCollections.checkItems(slot)
      deferred.resolve(slot)
    , (err) =>
      deferred.reject(err)

    deferred.promise
