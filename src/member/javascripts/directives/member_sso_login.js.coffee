angular.module('BBMember').directive 'memberSsoLogin', ($rootScope, LoginService) ->

  link = (scope, element, attrs) ->
    $rootScope.bb ||= {}
    $rootScope.bb.api_url ||= scope.apiUrl
    $rootScope.bb.api_url ||= "http://www.bookingbug.com"
    scope.member = null
    options =
      root: $rootScope.bb.api_url
      company_id: scope.companyId
    data = {token: scope.token}
    LoginService.ssoLogin(options, data).then (member) ->
      scope.member = member

  link: link
  scope:
    token: '@memberSsoLogin'
    companyId: '@'
    apiUrl: '@'
    member: '='
  transclude: true
  template: """
<div ng-hide='member'><img src='/BB_wait.gif' class="loader"></div>
<div ng-if='member' ng-transclude></div>
"""
