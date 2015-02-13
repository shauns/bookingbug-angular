'use strict'

angular.module('BB.Models').factory "Admin.EventModel", ($q, BBModel, BaseModel) ->

  class Admin_Event extends BaseModel

    constructor: (data) ->
      super(data)

