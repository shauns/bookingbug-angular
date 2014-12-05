'use strict';

angular.module('BB.Models').factory "ClientDetailsModel", ($q, BBModel, BaseModel) ->

  class ClientDetails extends BaseModel

    constructor: (data) ->
      super
      @questions = []
      if @_data
        for q in data.questions
          @questions.push( new BBModel.Question(q))
      @hasQuestions = (@questions.length > 0)


    getPostData : (questions) ->
      data = []
      for q in questions
        data.push({answer: q.answer, id: q.id, price: q.price})
      data


    # load the answers from an answer set - probably from loading an existing basket item
    setAnswers: (answers) ->
      # turn answers into a hash
      ahash = {}
      for a in answers
        ahash[a.question_id] = a

      for q in @questions
        if ahash[q.id]  # if we have answer for it
          q.answer = ahash[q.id].answer
