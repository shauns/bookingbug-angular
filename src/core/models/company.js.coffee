'use strict';

# helpful functions about a company
angular.module('BB.Models').factory "CompanyModel", ($q, BBModel, BaseModel) ->

  class Company extends BaseModel

    constructor: (data) ->
      super(data)
      @test = 1


    getSettings: () ->
      def = $q.defer()
      if @settings
        def.resolve(@settings)
      else
        if @$has('settings')
          @$get('settings').then (set) =>
            @settings = new BBModel.CompanySettings(set)
            def.resolve(@settings)
        else
          def.reject("Company has no settings")
      return def.promise

      