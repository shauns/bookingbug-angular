'use strict'

app = angular.module('BB', [
  'BB.Controllers',
  'BB.Filters',
  'BB.Models',
  'BB.Services',
  'BB.Directives',

  'angular-hal',
  'ui.bootstrap',
  'ngSanitize',
  'ui.map',
  'ui.utils',
  'ngLocalData',
  'ui.router',
  'ngAnimate',
  'angular-data.DSCacheFactory', # newer version of jmdobry angular cache
  'schemaForm',
  'ngStorage',
  'angularFileUpload'
])


# use this to inject application wide settings around the app
app.value('AppConfig', {})

if (window.use_no_conflict)
  window.bbjq = $.noConflict()
  app.value '$bbug', jQuery.noConflict(true)
else
  app.value '$bbug', jQuery

app.config ($locationProvider, $httpProvider, $provide) ->
  $httpProvider.defaults.headers.common =
    'App-Id': 'f6b16c23',
    'App-Key': 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'

  $locationProvider.html5Mode(false).hashPrefix('!')


app.run ($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig) ->
  # add methods to the rootscope if they are applicable to whole app
  $rootScope.$log = $log
  $rootScope.$setIfUndefined = FormDataStoreService.setIfUndefined

  $rootScope.bb ||= {}
  $rootScope.bb.api_url = $sessionStorage.getItem("host")

  # add bits of IE8 support
  if ($bbug.support.opacity == false)
    $document.createElement('header')
    $document.createElement('nav')
    $document.createElement('section')
    $document.createElement('footer')

angular.module('BB.Services', [
  'ngResource',
  'ngSanitize',
  'ngLocalData'
])

angular.module('BB.Controllers', [
  'ngLocalData',
  'ngSanitize'
])

angular.module('BB.Directives', [])
angular.module('BB.Filters', [])
angular.module('BB.Models', [])


window.angular.ieCreateHttpBackend = ($browser, XHR, $browserDefer, callbacks, rawDocument, locationProtocol, msie, xhr, $bbug) ->
  loc = window.location

  if !msie || msie > 9
    return null

  # ie doesn't have an origin property.
  loc.origin = loc.protocol + "//" + loc.host

  getHostName = (path) ->
    a = document.createElement('a')
    a.href = path
    return a.hostname

  # test to see if the resource is being requested from a differnt domain
  isLocalCall = (reqUrl) ->
    if (/^http(s)?/.test(reqUrl))
      if (reqUrl.indexOf(loc.origin) < 0)
        return false
    return true

  completeRequest = (callback, status, response, headersString) ->
    url = url || $browser.url()
    URL_MATCH = /^([^:]+):\/\/(\w+:{0,1}\w*@)?(\{?[\w\.-]*\}?)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/
    # URL_MATCH is defined in src/service/location.js
    protocol = (url.match(URL_MATCH) || ['', locationProtocol])[1]

    # fix status code for file protocol (it's always 0)
    #status = protocol == 'file' ? (response ? 200 : 404) : status
    # normalize IE bug (http:#bugs.jquery.com/ticket/1450)
    status = 204 if status == 1223
    callback(status, response, headersString)
    $browser.$$completeOutstandingRequest(angular.noop)

  pmHandler = (method, url, post, callback, headers, timeout, withCredentials) ->
    win = $bbug('[name="' + getHostName(url) + '"]')[0].id
    window.pm({
      target: window.frames[win],
      type: 'xhrRequest',
      data: {
        headers: headers,
        method: method,
        data: post,
        url: url
      },
      success: (respObj) ->
        resp = 'Content-Type: ' + respObj.contentType
        if (respObj.authToken)
          resp += "\nAuth-Token: " + respObj.authToken

        completeRequest(callback, 200, respObj.responseText, resp)
      ,
      error: (data) ->
        completeRequest(callback, 500, 'Error', 'Content-Type: text/plain')
    })

  res = (method, url, post, callback, headers, timeout, withCredentials) ->
    $browser.$$incOutstandingRequestCount()
    url = url || $browser.url()

    if (isLocalCall(url) )
      xhr(method, url, post, callback, headers, timeout, withCredentials)
    else
      pmHandler(method, url, post, callback, headers, timeout, withCredentials)

    if (timeout > 0)
      $browserDefer () ->
        window.status = -1
        xhr.abort()
      , timeout

  res




window.bookingbug =
  logout: (options) ->
    options ||= {}
    options.reload = true unless options.reload == false
    logout_opts =
      app_id: 'f6b16c23'
      app_key: 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
    logout_opts.root = options.root if options.root
    angular.injector(['BB.Services', 'BB.Models', 'ng'])
           .get('LoginService').logout(logout_opts)
    window.location.reload() if options.reload
