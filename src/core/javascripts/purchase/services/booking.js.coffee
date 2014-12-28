'use strict';

angular.module('BB.Services').factory "PurchaseBookingService", ($q, halClient, BBModel) ->

  update: (booking) ->
    deferred = $q.defer()
    data = booking.getPostData()
    booking.srcBooking.$put('self', {}, data).then (booking) =>
      deferred.resolve(new BBModel.Purchase.Booking(booking))
    , (err) =>
      deferred.reject(err, new BBModel.Purchase.Booking(booking))
    deferred.promise

  addSurveyAnswersToBooking: (booking) ->
    deferred = $q.defer()
    data = booking.getPostData()
    booking.$put('self', {}, data).then (booking) =>
      deferred.resolve(new BBModel.Purchase.Booking(booking))
    , (err) =>
      deferred.reject(err, new BBModel.Purchase.Booking(booking))
    deferred.promise
