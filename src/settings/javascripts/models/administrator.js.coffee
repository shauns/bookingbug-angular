'use strict'

angular.module('BB.Models').factory "Admin.AdministratorModel", ($q, BBModel, BaseModel) ->

  class Admin_Administrator extends BaseModel

    constructor: (data) ->
      super(data)

