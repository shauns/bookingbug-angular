'use strict';

angular.module('BB.Models').factory "ItemDetailsModel", ($q, BBModel, BaseModel, QuestionService) ->

  class ItemDetails extends BaseModel

    constructor: (data) ->
      @_data = data
      if @_data
        @self = @_data.$href("self")
      @questions = []
      @survey_questions = []
      if data
        for q in data.questions
          if (q.outcome) == false
            if data.currency_code then q.currency_code = data.currency_code
            @questions.push( new BBModel.Question(q))
          else
            @survey_questions.push( new BBModel.SurveyQuestion(q))
      @hasQuestions = (@questions.length > 0)
      @hasSurveyQuestions = (@survey_questions.length > 0)


    questionPrice: (qty) ->
      qty ||= 1
      @checkConditionalQuestions()
      price = 0
      for q in @questions
        price += q.selectedPriceQty(qty)
      price

    checkConditionalQuestions: () ->
      QuestionService.checkConditionalQuestions(@questions)


    getPostData: ->
      data = []
      for q in @questions
        data.push(q.getPostData()) if q.currentlyShown
      data

    # load the answers from an answer set - probably from loading an existing basket item
    setAnswers: (answers) ->
      # turn answers into a hash
      ahash = {}
      for a in answers
        ahash[a.id] = a

      for q in @questions
        if ahash[q.id]  # if we have answer for it
          q.answer = ahash[q.id].answer
      @checkConditionalQuestions()    

    getQuestion: (id) ->
      _.findWhere(@questions, {id: id})
