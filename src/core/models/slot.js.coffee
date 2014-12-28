'use strict';

angular.module('BB.Models').factory "SlotModel", ($q, BBModel, BaseModel) ->

  class Slot extends BaseModel

   constructor: (data) ->
      super(data)
      @datetime = moment(data.datetime)

   