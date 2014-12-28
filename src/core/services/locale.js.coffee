angular.module('BB.Services').factory 'LocaleService', ($window) ->

  locale = $window.getURIparam('locale')

  if locale
    return locale
  else if $window.navigator.language
    return $window.navigator.language
  else
    # US a default locale
    return "en"