
# returns a object literal version of the querystring. you can pass in a key
# name and it will return a value i.e. QueryStringService('ref')
angular.module('BB.Services').factory 'QueryStringService', ($window) ->
  return (keyName) ->
    varObj = {}
    href = $window.location.href

    if href.indexOf('?') < 0
      return false

    hashes = href.slice(href.indexOf('?') + 1).split('&')

    for hash in hashes
      hash = hash.split('=');
      # convert to number
      val = window.parseInt(hash[1], 10)

      # if it's not a number - or that the number length is different!
      if window.isNaN(val) || val.toString().length != hash[1].length
        # is boolean true
        if hash[1] is 'true'
          val = true
          # is boolean false
        else if hash[1] is 'false'
          val = false
        else
          val = window.decodeURIComponent(hash[1])
          # check if date
          if window.moment(val).isValid()
            val = moment(val)._d


      varObj[hash[0]] = val

    if keyName
      return varObj[keyName]
    return varObj;
