

class window.Collection.Day extends window.Collection.Base


  checkItem: (item) ->
    super


angular.module('BB.Services').provider "DayCollections", () ->
  $get: ->
    new  window.BaseCollections()
  



