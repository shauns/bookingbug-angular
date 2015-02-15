'use strict'

angular.module('BBAdminEvents', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Filters',
  'BBAdmin.Controllers',
  'trNgGrid'
])

angular.module('BBAdminEvents').config ($logProvider) ->
  $logProvider.debugEnabled(true)

angular.module('BBAdminEventsMockE2E', ['BBAdminEvents', 'BBAdminMockE2E'])
