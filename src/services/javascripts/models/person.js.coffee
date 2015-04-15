'use strict';

angular.module('BB.Models').factory "Admin.PersonModel", ($q, BBModel, BaseModel, PersonModel) ->

  class Admin_Person extends PersonModel

    constructor: (data) ->
      console.log "reating admin person", @
      super(data)



    setAttendance: (status) ->
      deferred = $q.defer()
      @$put('attendance', {}, {status: status}).then  (p) =>
        @updateModel(p)
        deferred.resolve(@)
      , (err) =>
        deferred.reject(err)

      deferred.promise