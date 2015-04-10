'use strict'

queueapp = angular.module('BBQueue', [
  'BB',
  'BBAdmin.Services',
])


queueapp.run ($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) ->

  AdminLoginService.checkLogin()
  if $rootScope.user && $rootScope.user.company_id
    $rootScope.bb ||= {}
    $rootScope.bb.company_id = $rootScope.user.company_id