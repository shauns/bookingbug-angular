'use strict';

angular.module('BB.Models').factory "PurchaseTotalModel", ($q, BBModel, BaseModel) ->

  class PurchaseTotal extends BaseModel

    constructor: (data) ->
      super(data)
      @promise = @_data.$get('purchase_items')
      @items = []
      @promise.then (items) =>
        for item in items
          @items.push(new BBModel.PurchaseItem(item))
      if @_data.$has('client')
       cprom = data.$get('client')
       cprom.then (client) =>
         @client = new BBModel.Client(client)


    icalLink: ->
      @_data.$href('ical')


    webcalLink: ->
      @_data.$href('ical')

    gcalLink: ->
      @_data.$href('gcal')  

    id: ->
      @get('id')
