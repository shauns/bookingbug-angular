

class window.Collection.Booking extends window.Collection.Base


  checkItem: (item) ->
    super

angular.module('BB.Services').provider "BookingCollections", () ->
  $get: ->
    new  window.BaseCollections()




