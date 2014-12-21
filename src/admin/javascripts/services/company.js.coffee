angular.module('BBAdmin.Services').factory 'AdminCompanyService', ($q,
    BBModel, AdminLoginService, $rootScope) ->

  query: (params) ->
    defer = $q.defer()
    $rootScope.bb ||= {}
    $rootScope.bb.api_url ||= params.apiUrl
    $rootScope.bb.api_url ||= "http://www.bookingbug.com"
    login_form =
      email: params.adminEmail
      password: params.adminPassword
    options =
      company_id: params.companyId
    AdminLoginService.login(login_form, options).then (user) ->
      user.$get('company').then (company) ->
        defer.resolve(company)
      , (err) ->
        defer.reject(err)
    , (err) ->
      defer.reject(err)
    defer.promise

