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

angular.module('BBScheduleTableE2E', ['BBScheduleTable', 'BBAdminMockE2E'])
