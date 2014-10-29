'use strict'

angular.module('BBPersonTable', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Filters',
  'BBAdmin.Controllers',
  'ui.state',
  'ui.calendar',
  'trNgGrid'
])

angular.module('BBPersonTable').config ($logProvider) ->
  $logProvider.debugEnabled(true)

angular.module('BBPersonTableMockE2E', ['BBPersonTable', 'BBAdminMockE2E'])
