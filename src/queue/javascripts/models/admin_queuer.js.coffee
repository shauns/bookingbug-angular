'use strict'

angular.module('BB.Models').factory "Admin.QueuerModel", ($q, BBModel, BaseModel) ->

  class Admin_Queuer extends BaseModel
  		

    serve: (person) ->
        deferred = $q.defer()
        @$put('serve_queuer', {}, {person_id: person.id}).then  (q) =>
          @updateModel(q)
          deferred.resolve(@)
        , (err) =>
          deferred.reject(err)

        deferred.promise