'use strict'

angular.module('BB.Models').factory "Admin.ScheduleModel", ($q, BBModel, BaseModel) ->

  class Admin_Schedule extends BaseModel

    constructor: (data) ->
      super(data)

