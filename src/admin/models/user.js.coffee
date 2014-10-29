'use strict'

angular.module('BB.Models').factory "Admin.UserModel", ($q, BBModel, BaseModel) ->

  class Admin_User extends BaseModel

    constructor: (data) ->
      super(data)
      @companies = []
      if data
        if @$has('companies')
          @$get('companies').then (comps) =>
            @companies = comps

