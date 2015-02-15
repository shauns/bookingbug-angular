'use strict'

angular.module('BB.Models').factory "Admin.EventChainModel", ($q, BBModel, BaseModel) ->

  class Admin_EventChain extends BaseModel

    constructor: (data) ->
      super(data)

