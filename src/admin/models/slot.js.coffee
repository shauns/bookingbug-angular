'use strict'

angular.module('BB.Models').factory "Admin.SlotModel", ($q, BBModel, BaseModel, TimeSlotModel) ->

  class Admin_Slot extends TimeSlotModel

    constructor: (data) ->
      super(data)
      @title = @full_describe
      if @status == 0
        @title = "Available"
      @datetime = moment(@datetime)
      @start = @datetime
      @end = @datetime.clone().add('minutes', @duration)
      @allDay = false
      if @status == 3
        @className = "status_blocked"
      else if @status == 4
        @className = "status_booked"
      else if @status == 0
        @className = "status_available"
