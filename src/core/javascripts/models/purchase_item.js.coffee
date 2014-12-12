
'use strict';

angular.module('BB.Models').factory "PurchaseItemModel", ($q, BBModel, BaseModel) ->

  class PurchaseItem extends BaseModel

    constructor: (data) ->
      super(data)
      @parts_links = {}
      if data
        if data.$has('service')
          @parts_links.service = data.$href('service')
        if data.$has('resource')
          @parts_links.resource = data.$href('resource')
        if data.$has('person')
          @parts_links.person = data.$href('person')
        if data.$has('company')
          @parts_links.company = data.$href('company')

    describe: ->
      @get('describe')    

    full_describe: ->
      @get('full_describe')    


    hasPrice: ->
      return (@price && @price > 0)
      

