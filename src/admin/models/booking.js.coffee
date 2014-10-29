'use strict'

angular.module('BB.Models').factory "Admin.BookingModel", ($q, BBModel, BaseModel) ->

  class Admin_Booking extends BaseModel

    constructor: (data) ->
      super
      @datetime = moment(@datetime)
      @start = @datetime
      @end = @datetime.clone().add('minutes', @duration)
      @title = @full_describe
      @allDay = false
      if @status == 3
        @className = "status_blocked"
      else if @status == 4
        @className = "status_booked"

    getPostData: () ->
      data = {}
      data.date = @start.format("YYYY-MM-DD")
      data.time = @start.hour()*60 + @start.minute()
      data.duration = @duration
      data.id = @id
      data

    $update: () ->
      data = @getPostData()
      @$put('self', {}, data).then (res) =>
        @constructor(res)
        console.log @

