angular.module('BBAdmin.Services').factory 'AdminBookingService',
($q, $window, halClient, BookingCollections, BBModel) ->

  query: (prms) ->
    if prms.slot
      prms.slot_id = prms.slot.id
    url = ""
    url = prms.url if prms.url
    href = url + "/api/v1/admin/{company_id}/bookings{?slot_id,start_date,end_date,service_id,resource_id,person_id,page,per_page,include_cancelled}"
    uri = new $window.UriTemplate.parse(href).expand(prms || {})

    deferred = $q.defer()
    halClient.$get(uri, {}).then  (found) =>
      found.$get('bookings').then (items) =>
        sitems = []
        for item in items
          sitems.push(new BBModel.Admin.Booking(item))
        spaces  = new $window.Collection.Booking(found, sitems, prms)
        BookingCollections.add(spaces)
        deferred.resolve(spaces)
    , (err) =>
      deferred.reject(err)

    deferred.promise
