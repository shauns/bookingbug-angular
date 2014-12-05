'use strict';

angular.module('BB.Models').factory "EventGroupModel", ($q, BBModel, BaseModel) ->
  class EventGroup extends BaseModel
    name: () ->
      @_data.name

    colour: () ->
      @_data.colour
