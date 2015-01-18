
#
angular.module('BB.Services').factory 'QuestionService', ($window, QueryStringService) ->
  defaults = QueryStringService() or {}

  convertDates = (obj) ->
    _.each obj, (val, key) ->
      date = $window.moment(obj[key])
      if _.isString(obj[key]) and date.isValid()
        obj[key] = date


  #  store any values from $window.bb_setup if it exists
  if $window.bb_setup
    convertDates($window.bb_setup)
    angular.extend(defaults, $window.bb_setup)


  # adds an answer property to a question object if the id of the question
  # matches the id of the values stored in the defaults object. this would
  # almost defintiely be used to get values from the querystring i.e.
  # ?14393=Wedding&14392=true
  addAnswersById = (questions) ->
    if !questions
      return

    if angular.isArray questions
      _.each questions, (question) ->
        id = question.id + ''

        if !question.answer and defaults[id]
          question.answer = defaults[id]
    else
      questions.answer = defaults[questions.id + '']
    return


  # converts a string to a clean, snake case string. it's used to convert
  # question names into snake case so they can be accessed using the object dot
  # notation and match any values set using $window.bb_set_up
  convertToSnakeCase = (str) ->
    str = str.toLowerCase();
    str = $.trim(str)
    # replace all punctuation and special chars
    str = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '')
    # replace any double or more spaces
    str = str.replace(/\s{2,}/g, ' ')
    # convert to sanke case
    str = str.replace(/\s/g, '_')
    return str


  # takes an array of questions objects. loops through the questions gettting
  # the obj.name value and converting it into snake case. then loop through the
  # stored value key name and see if there is whole or partial match.
  addDynamicAnswersByName = (questions) ->
    if angular.isArray questions
      keys = _.keys(defaults)

      _.each questions, (question) ->
        name = convertToSnakeCase(question.name)
        _.each keys, (key) ->
          if name.indexOf(key) >= 0
            if defaults[key] and !question.answer
              question.answer = defaults[key]
              delete defaults[key]
          return


  # takes an object and array of key names. it loops through key names and if
  # they match the key names in the stored values, then the values are added to
  # calling obj.
  addAnswersByName = (obj, keys) ->
    type = Object.prototype.toString.call(obj).slice(8,-1)

    if type is 'Object' and angular.isArray(keys)
      for key in keys
        # only add property to calling object if it doesn't have a property
        if defaults[key] and !obj[key]
          obj[key] = defaults[key]
          # remove it once it's set otherwise there could be a lot of issues
          delete defaults[key]
      return


  # takes an array of questions and an answers object, which then matches answers by 
  # thier key name to the questions help_text value
  addAnswersByKey = (questions, answers) ->
    for question in questions
      name = question.help_text
      question.answer = answers[name] if answers[name]


  storeDefaults = (obj) ->
    angular.extend(defaults, obj.bb_setup or {})


  return {
    getStoredData   : ->
      return defaults

    storeDefaults           : storeDefaults
    addAnswersById          : addAnswersById
    addAnswersByName        : addAnswersByName
    addDynamicAnswersByName : addDynamicAnswersByName
    addAnswersByKey         : addAnswersByKey
    convertToSnakeCase      : convertToSnakeCase
  }
