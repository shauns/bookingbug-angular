'use strict';

angular.module('BB.Models').factory "BasketModel", ($q, BBModel, BaseModel) ->

  class Basket extends BaseModel
    constructor: (data, scope) ->
      if scope && scope.isAdmin
        @is_admin = scope.isAdmin
      else
        @is_admin = false
      @items = []
      super(data)


    addItem: (item) ->
      # check if then item is already in the basket

      for i in @items
        if i == item
          return
        if i.id && item.id && i.id == item.id
          return
      @items.push(item)

    clear: () ->
      @items = []

    # should we try to checkout ?
    readyToCheckout: ->
      if @items.length > 0
        return true
      else
        return false


    setSettings: (set) ->
      return if !set
      @settings ||= {}
      $.extend(@settings, set)

    setClient: (client) ->
      @client = client

    setClientDetails: (client_details) ->
      @client_details = new BBModel.PurchaseItem(client_details)


    getPostData: ->
      post =
        client: @client.getPostData()
        settings: @settings
        reference: @reference
      post.is_admin = @is_admin
      post.items = []
      for item in @items
        post.items.push(item.getPostData())
      return post


    # the amount due now - taking account of any wait list items
    dueTotal: ->
      total = @total_price
      for item in @items
        total -= item.price if item.isWaitlist()
      total = 0 if total < 0
      total

    length: ->
      @items.length
