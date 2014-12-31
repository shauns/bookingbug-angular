angular.module('BBAdminServices').factory 'AdminScheduleService',  ($q, $window,
    $rootScope, halClient, SlotCollections, BBModel, LoginService) ->

  query: (prms) ->
    if prms.company
      prms.company_id = prms.company.id
    url = ""
    url = $rootScope.bb.api_url if $rootScope.bb.api_url
    href = url + "/api/v1/admin/{company_id}/schedules"

    uri = new $window.UriTemplate.parse(href).expand(prms || {})
    deferred = $q.defer()
    halClient.$get(uri, {}).then  (resource) =>
      resource.$get('schedules').then (items) =>
        schedules = []
        for i in items
          schedules.push(new BBModel.Admin.Schedule(i))
        deferred.resolve(schedules)
    , (err) =>
      deferred.reject(err)

    deferred.promise
