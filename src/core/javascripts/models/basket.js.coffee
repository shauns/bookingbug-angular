'use strict';

angular.module('BB.Models').factory "BasketModel", ($q, BBModel, BaseModel) ->

  class Basket extends BaseModel
    constructor: (data, scope) ->
      if scope && scope.isAdmin
        @is_admin = scope.isAdmin
      else
        @is_admin = false
      if scope? && scope.parent_client
        @parent_client_id = scope.parent_client.id
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


    timeItems: ->
      titems = []
      for i in @items
        titems.push(i) if !i.is_coupon
      titems

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
      post.parent_client_id = @parent_client_id
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


    questionPrice: ->
      price = 0
      for item in @items
        price += item.questionPrice()
      return price

    totalPrice: ->
      price = 0
      for item in @items
        price += item.totalPrice()
      return price


    fullPrice: ->
      price = 0
      for item in @items
        price += item.fullPrice()
      return price

    hasCoupon: ->
      for item in @items
        return true if item.is_coupon
      return false
    

    totalDuration: ->
      duration = 0
      for item in @items
        duration =+ item.service.listed_duration if item.service and item.service.listed_duration
      return duration