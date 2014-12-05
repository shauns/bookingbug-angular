angular.module('BB.Models').factory "ItemDetailsModel", ($q, BBModel, BaseModel) ->

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


    questionPrice: () ->
      @checkConditionalQuestions()
      price = 0
      for q in @questions
        price += q.selectedPrice()
      price

    checkConditionalQuestions: () ->
      for q in @questions
        if q.settings && q.settings.conditional_question
          cond = @findByQuestionId(parseInt(q.settings.conditional_question))
          if cond
            # check if the question has an answer which means "show"
            ans = cond.getAnswerId()
            found = false
            if _.isEmpty(q.settings.conditional_answers) && cond.detail_type == "check" && !cond.answer
              # this is messy - we're showing the question when we ahve a checkbox conditional, based on it being unticked
              found = true

            for a,v of q.settings.conditional_answers
              if a[0] == 'c' && parseInt(v) == 1 && cond.answer
                found = true
              else if parseInt(a) == ans && parseInt(v) == 1
                found = true
            if found
              q.showElement()
            else
              q.hideElement()

    findByQuestionId: (qid) ->
      for q in @questions
        return q if q.id == qid
      return null


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
