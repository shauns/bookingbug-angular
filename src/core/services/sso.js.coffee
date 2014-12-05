angular.module('BB.Services').factory "SSOService", ($q, $rootScope, halClient, LoginService) ->

  memberLogin: (options) ->
    deferred = $q.defer()
    options.root ||= ""
    url = options.root + "/api/v1/login/sso/" + options.company_id
    data = {token: options.member_sso}
    halClient.$post(url, {}, data).then (login) =>
      params = {auth_token: login.auth_token}
      login.$get('member').then (member) =>
        member = LoginService.setLogin(member)
        deferred.resolve(member)
    , (err) =>
      deferred.reject(err)
    deferred.promise
