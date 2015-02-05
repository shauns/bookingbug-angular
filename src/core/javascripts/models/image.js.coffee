'use strict';

angular.module('BB.Models').factory "ImageModel", ($q, $filter, BBModel, BaseModel) ->

  class Image extends BaseModel

    constructor: (data) ->
      super(data)
