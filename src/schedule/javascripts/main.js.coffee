'use strict'

angular.module('BBScheduleTable', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Filters',
  'BBAdmin.Controllers',
  'trNgGrid'
])

angular.module('BBScheduleTable').config ($logProvider) ->
  $logProvider.debugEnabled(true)

angular.module('BBScheduleTableMockE2E', ['BBScheduleTable', 'BBAdminMockE2E'])
