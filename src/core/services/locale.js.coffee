angular.module('BB.Services').factory 'LocaleService', ($window) ->

  if (typeof $window.getURIparam != 'undefined')
    locale = $window.getURIparam('locale')
  else
    return 'en'

  if locale
    return locale
  else if $window.navigator && $window.navigator.language
    return $window.navigator.language
  else
    # US a default locale
    return "en"
