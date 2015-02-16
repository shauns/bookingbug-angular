'use strict'

angular.module('BB.Models').factory "Admin.EventGroupModel", ($q, BBModel, BaseModel) ->

  class Admin_EventGroup extends BaseModel

    constructor: (data) ->
      super(data)

