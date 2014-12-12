

class window.Collection.Space extends window.Collection.Base


  checkItem: (item) ->
    super


angular.module('BB.Services').provider "SpaceCollections", () ->
  $get: ->
    new  window.BaseCollections()




