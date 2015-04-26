'use strict'

clinicapp = angular.module('BBClinic', [
  'BB',
  'BBAdmin.Services',
  'BBAdmin.Directives',
  'BBClinic.Services',
  'BBClinic.Directives',
  'BBClinic.Controllers',
  'BBAdminServices'
  'trNgGrid',
  'ngDragDrop',
  'pusher-angular'

])

angular.module('BBClinic.Directives', [
  'timer'
])

angular.module('BBClinic.Controllers', [])

angular.module('BBClinic.Services', [
  'ngResource',
  'ngSanitize',
  'ngLocalData'
])


angular.module('BBClinicMockE2E', ['BBClinic', 'BBAdminMockE2E'])


clinicapp.run ($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) ->

  # AdminLoginService.checkLogin()
  # if $rootScope.user && $rootScope.user.company_id
  #   $rootScope.bb ||= {}
  #   $rootScope.bb.company_id = $rootScope.user.company_id
