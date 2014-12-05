angular.module('BB.Services').factory 'AlertService', ($rootScope, ErrorService) ->

  $rootScope.alerts = []

  titleLookup = (type, title) ->
    return title if title
    switch type
      when "error", "danger"
        title = "Error"
      else
        title = null
    title

  alertService =
    add: (type, {title, msg}) ->
      $rootScope.alerts = []
      $rootScope.alerts.push
        type: type
        title: titleLookup(type, title)
        msg: msg
        close: -> alertService.closeAlert(this)
      $rootScope.$emit "alert:raised"


    closeAlert: (alert) ->
      @closeAlertIdx $rootScope.alerts.indexOf(alert)

    closeAlertIdx: (index) ->
      $rootScope.alerts.splice index, 1

    clear: ->
      $rootScope.alerts = []

    error: (alert) ->
      @add('error', {title: alert.title, msg: alert.msg})

    danger: (alert) ->
      @add('danger', {title: alert.title, msg: alert.msg})
