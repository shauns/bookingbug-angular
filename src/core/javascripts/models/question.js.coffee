'use strict';

angular.module('BB.Models').factory "QuestionModel", ($q, $filter, BBModel, BaseModel) ->

  class Question extends BaseModel

    constructor: (data) ->
      # weirdly quesiton is  not currently initited as a hal object
      super(data)

      if @price
        @price = parseFloat(@price)
      if @_data.default
        @answer=@_data.default
      else if @_data.options
        for option in @_data.options
          if option.is_default
            @answer=option.name
          if @hasPrice()
            option.price = parseFloat(option.price)
            currency = if data.currency_code then data.currency_code else 'GBP'
            option.display_name = "#{option.name} (#{$filter('currency')(option.price, currency)})"
          else
            option.display_name = option.name
      if @_data.detail_type == "check"
        @answer =(@_data.default && @_data.default == "1")

      @currentlyShown = true

    hasPrice: ->
      return @detail_type == "check-price" || @detail_type == "select-price"  || @detail_type == "radio-price"

    selectedPrice: ->
      return 0 if !@hasPrice()
      if @detail_type == "check-price"
        return (@answer ? @price ? 0)
      for option in @_data.options
        return option.price if @answer == option.name
      return 0

    getAnswerId: ->
      return null if !@answer || !@options || @options.length == 0
      for o in @options
        return o.id if @answer == o.name
      return null

    showElement: ->
      @currentlyShown = true

    hideElement: ->
      @currentlyShown = false

    getPostData: ->
      x = {}
      x.id = @id
      x.answer = @answer
      x.answer = moment(@answer).format("YYYY-MM-DD") if @detail_type == "date" && @answer
      p = @selectedPrice()
      x.price = p if p
      x
