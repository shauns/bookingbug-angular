'use strict'

angular.module('BB.Models').factory "Admin.QueuerModel", ($q, BBModel, BaseModel) ->

  class Admin_Queuer extends BaseModel

    constructor: (data) ->
      super(data)

      @due = moment.parseZone(@due)


    remaining: () ->
      d = @due.diff(moment.utc(), 'seconds')
      @remaining_signed = Math.abs(d);
      @remaining_unsigned = d


    startServing: (person) ->
      defer = $q.defer()
      if @$has('start_serving')
        person.$flush('self')
        @$post('start_serving', {person_id: person.id}).then  (q) =>
          person.$get('self').then (p) -> person.updateModel(p)
          @updateModel(q)
          defer.resolve(@)
        , (err) =>
          defer.reject(err)
      else
        defer.reject('start_serving link not available')
      defer.promise

    finishServing: () ->
      defer = $q.defer()
      if @$has('finish_serving')
        @$post('finish_serving').then  (q) =>
          @updateModel(q)
          defer.resolve(@)
        , (err) =>
          defer.reject(err)
      else
        defer.reject('finish_serving link not available')
      defer.promise

