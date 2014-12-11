'use strict'

angular.module('BBAdminTable', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Filters',
  'BBAdmin.Controllers',
  # 'ui.router',
  # 'ui.state',
  # 'ui.calendar',
  'trNgGrid'
])

angular.module('BBAdminTable').config ($logProvider) ->
  $logProvider.debugEnabled(true)

angular.module('BBAdminTableMockE2E', ['BBAdminTable', 'BBAdminMockE2E'])
