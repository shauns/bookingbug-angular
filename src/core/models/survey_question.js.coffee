'use strict';

angular.module('BB.Models').factory "SurveyQuestionModel", ($q, $window, BBModel, BaseModel, QuestionModel) ->

  class SurveyQuestion extends QuestionModel