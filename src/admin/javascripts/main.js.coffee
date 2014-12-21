'use strict'

angular.module('BBAdmin', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Filters',
  'BBAdmin.Controllers'
  # 'ui.state',
#  'ui.calendar',
])

angular.module('BBAdmin').config ($logProvider) ->
  $logProvider.debugEnabled(true)

angular.module('BBAdmin.Directives', [])

angular.module('BBAdmin.Filters', [])

angular.module('BBAdmin.Services', [
  'ngResource',
  'ngSanitize',
  'ngLocalData'
])

angular.module('BBAdmin.Controllers', [
  'ngLocalData',
  'ngSanitize'
])
