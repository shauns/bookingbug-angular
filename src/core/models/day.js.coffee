
'use strict';

angular.module('BB.Models').factory "DayModel", ($q, BBModel, BaseModel) ->

  class Day extends BaseModel

    constructor: (data) ->
      super
      @string_date = @date
      @date = moment(@date)

    day: ->
      @date.date()

    off: (month) ->
      @date.month() != month

    class: (month) ->
      str = ""
      if @date.month() < month
        str += "off off-prev"
      if @date.month() > month
        str += "off off-next"
      if @spaces == 0
        str += " not-avail"
      str