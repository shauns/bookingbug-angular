

'use strict';

angular.module('BB.Models').factory "EventTicketModel", ($q, BBModel, BaseModel) ->

  class EventTicket extends BaseModel
    fullName: () ->
      if @pool_name
        return @pool_name + " - " + @name
      @name

    getRange: (cap) ->
      max = @max_num_bookings

      if @max_spaces
        ms = @max_spaces
        ms = @max_spaces / @counts_as if @counts_as
        if ms < max
          max = ms
      if cap
        c = cap
        c = cap / @counts_as if @counts_as
        if c + @min_num_bookings < max
          max = c + @min_num_bookings

      [@min_num_bookings..max]
