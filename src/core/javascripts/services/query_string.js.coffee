
# returns a object literal version of the querystring. you can pass in a key
# name and it will return a value i.e. QueryStringService('ref')
angular.module('BB.Services').factory 'QueryStringService', ($window) ->
  return (keyName) ->
    varObj = {}
    href = $window.location.href

    if href.indexOf('?') < 0
      return

    hashes = href.slice(href.indexOf('?') + 1).split(/[#&]/)

    #  check query string value is a number
    isNum = (num) ->
      # if num is not defined
      if !num?
        return
      # starts with 0
      if num.substr(0,1) is '0'
        return
       # contains chars
      if /[a-zA-Z\-\_\+\.\#\%\*\,]/.test(num)
        return
      # is not a number
      if window.isNaN(window.parseInt(num, 10))
        return
      return true


    for hash in hashes
      hash = hash.split('=');
      # convert to number
      val = hash[1]

      # if it's not a number - or that the number length is different!
      if isNum(val)
        val = window.parseInt(val, 10)
      else
        # is boolean true
        if val is 'true'
          val = true
          # is boolean false
        else if val is 'false'
          val = false
        else
          val = window.decodeURIComponent(val)
          # Removed date check as it attempts to convert strings like '0027' to a date
          # It should be on the onus of the user of the QueryStringService to attempt to instantinate
          # as a moment object
          # check if date
          #if window.moment(val).isValid()
          #  val = moment(val)._d


      varObj[hash[0]] = val

    if keyName
      return varObj[keyName]
    return varObj;
