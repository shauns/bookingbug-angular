'use strict'

angular.module('BBAdminSettings', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Filters',
  'BBAdmin.Controllers',
  # 'ui.router',
  # 'ui.state',
  # 'ui.calendar',
  'trNgGrid'
])

angular.module('BBAdminSettings').config ($logProvider) ->
  $logProvider.debugEnabled(true)

angular.module('BBAdminSettingsMockE2E', ['BBAdminSettings', 'BBAdminMockE2E'])
