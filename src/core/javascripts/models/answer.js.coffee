'use strict';

angular.module('BB.Models').factory "AnswerModel", ($q, BBModel, BaseModel, $bbug) ->

  class Answer extends BaseModel
    constructor: (data) ->
      super(data)

    getQuestion: () ->
      defer = new $bbug.Deferred()
      defer.resolve(@question) if @question
      if @_data.$has('question')
        @_data.$get('question').then (question) =>
          @question = question
          defer.resolve(@question)
      else
        defer.resolve([])
      defer.promise()

