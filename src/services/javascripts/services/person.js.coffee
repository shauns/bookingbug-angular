angular.module('BBAdminServices').factory 'AdminPersonService',  ($q, $window,
    $rootScope, halClient, SlotCollections, BBModel, LoginService) ->

  query: (prms) ->
    if prms.company
      prms.company_id = prms.company.id
    url = ""
    url = $rootScope.bb.api_url if $rootScope.bb.api_url
    href = url + "/api/v1/admin/{company_id}/people"

    uri = new $window.UriTemplate.parse(href).expand(prms || {})
    deferred = $q.defer()
    halClient.$get(uri, {}).then  (resource) =>
      resource.$get('people').then (items) =>
        people = []
        for i in items
          people.push(new BBModel.Person(i))
        deferred.resolve(people)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  block: (company, person, data) ->
    prms = {id:  person.id, company_id: company.id}

    deferred = $q.defer()
    href = "/api/v1/admin/{company_id}/people/{id}/block"
    uri = new $window.UriTemplate.parse(href).expand(prms || {})

    halClient.$put(uri, {}, data).then  (slot) =>
      slot = new BBModel.Admin.Slot(slot)
      SlotCollections.checkItems(slot)
      deferred.resolve(slot)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  signup: (user, data) ->
    defer = $q.defer()
    user.$get('company').then (company) ->
      params = {}
      company.$post('people', params, data).then (person) ->
        if person.$has('administrator')
          person.$get('administrator').then (user) ->
            LoginService.setLogin(user)
            defer.resolve(person)
        else
          defer.resolve(person)
      , (err) ->
        defer.reject(err)
      defer.promise

