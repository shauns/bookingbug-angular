angular.module('BB.Services').factory "PurchaseService", ($q, halClient, BBModel, $window) ->

  query: (params) ->
    defer = $q.defer()
    uri = params.url_root+"/api/v1/purchases/"+params.purchase_id
    halClient.$get(uri, params).then (purchase) ->
      purchase = new BBModel.Purchase.Total(purchase)
      defer.resolve(purchase)
    , (err) ->
      defer.reject(err)
    defer.promise


  bookingRefQuery: (params) ->
    defer = $q.defer()
    uri = new $window.UriTemplate.parse(params.url_root + "/api/v1/purchases/booking_ref/{booking_ref}{?raw}").expand(params)
    halClient.$get(uri, params).then (purchase) ->
      purchase = new BBModel.Purchase.Total(purchase)
      defer.resolve(purchase)
    , (err) ->
      defer.reject(err)
    defer.promise


  update: (params) ->
    defer = $q.defer()

    if !params.purchase
      defer.reject("No purchase present")
      return defer.promise

    # only send email on the alst items we're moving - otherwise we'#ll send an email on each item!
    data = {}

    if params.bookings
      bdata = []
      for booking in params.bookings
        bdata.push(booking.getPostData())
      data.bookings = bdata

    params.purchase.$put('self', {}, data).then (purchase) =>
      purchase = new BBModel.Purchase.Total(purchase)
      defer.resolve(purchase)
    , (err) =>
      defer.reject(err)
    defer.promise