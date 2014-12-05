'use strict';

angular.module('BB.Models').factory "EventSequenceModel", ($q, BBModel, BaseModel) ->

  class EventSequence extends BaseModel
    name: () ->
      @_data.name
