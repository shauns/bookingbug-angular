'use strict';

angular.module('BB.Models').factory "Purchase.TotalModel", ($q, $window,
    BBModel, BaseModel, $sce) ->


  class Purchase_Total extends BaseModel
    constructor: (data) ->
      super(data)
      @getItems().then (items) =>
        @items = items
      @getClient().then (client) =>
        @client = client

    id: ->
      @get('id')

    icalLink: ->
      @_data.$href('ical')

    webcalLink: ->
      @_data.$href('ical')

    gcalLink: ->
      @_data.$href('gcal')

    getItems: =>
      defer = $q.defer()
      defer.resolve(@items) if @items
      items = []
      @getBookingsPromise().then (bookings) =>
        items = items.concat(bookings) if bookings? && bookings.length > 0
        @getPackages().then (packages) ->
          items = items.concat(packages) if packages? && packages.length > 0
          defer.resolve(items)
        , () ->
          defer.resolve(items)
      , () ->
        @getPackages().then (packages) ->
          items = items.concat(packages) if packages? && packages.length > 0
          defer.resolve(items)
      defer.promise

    getBookingsPromise: =>
      defer = $q.defer()
      defer.resolve(@bookings) if @bookings
      if @_data.$has('bookings')
        @_data.$get('bookings').then (bookings) =>
          @bookings = (new BBModel.Purchase.Booking(b) for b in bookings)
          @bookings.sort (a, b) => a.datetime.unix() - b.datetime.unix()
          defer.resolve(@bookings)
      else
        defer.reject("No bookings")
      defer.promise

    getPackages: =>
      defer = $q.defer()
      defer.resolve(@packages) if @packages
      if @_data.$has('packages')
        @_data.$get('packages').then (packages) =>
          defer.resolve(@packages)
      else
        defer.reject('No packages')
      defer.promise

    getProducts: =>
      defer = $q.defer()
      defer.resolve(@products) if @products
      if @_data.$has('products')
        @_data.$get('products').then (products) =>
          defer.resolve(@products)
      else
        defer.reject('No products')
      defer.promise

    getMessages: (booking_texts, msg_type) =>
      defer = $q.defer()
      booking_texts = (bt for bt in booking_texts when bt.message_type == msg_type)
      if booking_texts.length == 0
        defer.resolve([])
      else
        @getItems().then (items) ->
          msgs = []
          for booking_text in booking_texts
            for item in items
              for type in ['company','person','resource','service']
                if item.$has(type) && item.$href(type) == booking_text.$href('item')
                  if msgs.indexOf(booking_text.message) == -1
                    msgs.push(booking_text.message)
          defer.resolve(msgs)
      defer.promise

    getClient: =>
      defer = $q.defer()
      if @_data.$has('client')
        @_data.$get('client').then (client) =>
          @client = new BBModel.Client(client)
          defer.resolve(@client)
      else
        defer.reject('No client')
      defer.promise

    getConfirmMessages: () =>
      defer = $q.defer()
      if @_data.$has('confirm_messages')
        @_data.$get('confirm_messages').then (msgs) =>
          @getMessages(msgs, 'Confirm').then (filtered_msgs) =>
            defer.resolve(filtered_msgs)
      else
        defer.reject('no messages')
      defer.promise

    printed_total_price: () ->
      return "£" + parseInt(@total_price) if parseFloat(@total_price) % 1 == 0
      return $window.sprintf("£%.2f", parseFloat(@total_price))

    newPaymentUrl: () ->
      if @_data.$has('new_payment')
        $sce.trustAsResourceUrl(@_data.$href('new_payment'))