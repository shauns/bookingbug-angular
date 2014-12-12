
'use strict';

angular.module('BB.Models').factory "EventModel", ($q, BBModel, BaseModel) ->


  class Event extends BaseModel
    constructor: (data) ->
      super(data)
      @getDate()
      @time = new BBModel.TimeSlot
        time: parseInt(@date.format('h'))*60 + parseInt(@date.format('mm'))

    getGroup: () ->
      defer = $q.defer()
      if @group
        defer.resolve(@group)
      else if @$has('event_groups')
        @$get('event_groups').then (group) =>
          @group = new BBModel.EventGroup(group)
          defer.resolve(@group)
        , (err) ->
          defer.reject(err)
      else
        defer.reject("No event group")
      defer.promise

    getChain: () ->
      defer = $q.defer()
      if @chain
        defer.resolve(@chain)
      else
        if @$has('event_chains')
          @$get('event_chains').then (chain) =>
            @chain = new BBModel.EventChain(chain)
            defer.resolve(@chain)
        else
          defer.reject("No event chain")
      defer.promise

    getDate: () ->
      return @date if @date
      @date = moment(@_data.datetime)
      return @date

    dateString: (str) ->
      date = @date()
      if date then date.format(str)

    getDuration: () ->
      defer = new $q.defer()
      if @duration
        defer.resolve(@duration)
      else
        @getChain().then (chain) =>
          @duration = chain.duration
          defer.resolve(@duration)
      defer.promise

    printDuration: () ->
      if @duration < 60
        @duration + " mins"
      else
        h = Math.round(@duration / 60)
        m = @duration % 60
        if m == 0
          h + " hours"
        else
          h + " hours " + m + " mins"

    getDescription: () ->
      @getChain().description

    getColour: () ->
      if @getGroup()
        return @getGroup().colour
      else
        return "#FFFFFF"

    getPerson: () ->
      @getChain().person_name

    getPounds: () ->
      if @chain
        Math.floor(@getPrice()).toFixed(0)

    getPrice: () ->
      0

    getPence: () ->
      if @chain
        (@getPrice() % 1).toFixed(2)[-2..-1]

    getNumBooked: () ->
      @spaces_blocked + @spaces_booked + @spaces_reserved

    getSpacesLeft: () ->
      return @num_spaces - @getNumBooked()

    hasSpace: () ->
      (@getSpacesLeft() > 0)

    hasWaitlistSpace: () ->
      (@getSpacesLeft() <= 0 && @getChain().waitlength > @spaces_wait)

    getRemainingDescription: () ->
      left = @getSpacesLeft()
      if left > 0 && left < 3
        return "Only " + left + " " + (if left > 1 then "spaces" else "space") + " left"
      if @hasWaitlistSpace()
        return "Join Waitlist"
      return ""


    prepEvent: () ->
      # build out some usefull event stuff
      def = $q.defer()
      @getChain().then () =>
        @chain.getTickets().then (tickets) =>
          @tickets = tickets
          def.resolve()
      def.promise
