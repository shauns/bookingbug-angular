'use strict';

angular.module('BB.Models').factory "Admin.PersonModel", ($q, BBModel, BaseModel, PersonModel) ->

  class Admin_Person extends PersonModel

    constructor: (data) ->
      console.log "reating admin person", @
      super(data)

    setAttendance: (status) ->
      defer = $q.defer()
      @$put('attendance', {}, {status: status}).then  (p) =>
        @updateModel(p)
        defer.resolve(@)
      , (err) =>
        defer.reject(err)
      defer.promise

    finishServing: () ->
      defer = $q.defer()
      if @$has('finish_serving')
        @$post('finish_serving').then (q) =>
          defer.resolve(q)
        , (err) =>
          defer.reject(err)
      else
        defer.reject('finish_serving link not available')
      defer.promise
