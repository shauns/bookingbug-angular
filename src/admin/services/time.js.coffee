

angular.module('BBAdmin.Services').factory 'AdminTimeService',
($q, $window, halClient, BBModel) ->

  query: (prms) ->
    if prms.day
      prms.date = prms.day.date
    url = ""
    url = prms.url if prms.url
    href = url + "/api/v1/{company_id}/time_data{?date,event_id,service_id}"

    uri = new $window.UriTemplate.parse(href).expand(prms || {})
    deferred = $q.defer()
    halClient.$get(uri, {}).then  (found) =>
      times = []
      for afound in found.times
        for i in afound.data
          ts = new BBModel.TimeSlot(i)
          ts.id = afound.id
          times.push(ts)
      deferred.resolve(times)
    , (err) =>
      deferred.reject(err)

    deferred.promise
