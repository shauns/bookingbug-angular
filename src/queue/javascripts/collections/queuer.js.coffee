class window.Collection.Queuer extends window.Collection.Base


  checkItem: (item) ->
    super

  matchesParams: (item) ->
    if @params.start_date?
      @start_date ?= moment(@params.date)
      return false if @start_date.isAfter(item.start)
    if @params.end_date?
      @end_date ?= moment(@params.end_date)
      return false if @end_date.isBefore(item.start.clone().startOf('day'))
    return true


angular.module('BB.Services').provider "QueuerCollections", () ->
  $get: ->
    new  window.BaseCollections()