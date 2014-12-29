
angular.module('BBAdmin.Services').factory "AdminLoginService", ($q, halClient, $rootScope, BBModel, $sessionStorage) ->
 
  login: (form, options) ->
    deferred = $q.defer()
    url = "#{$rootScope.bb.api_url}/api/v1/login/admin"
    if (options? && options.company_id?)
      url = "#{url}/#{options.company_id}"
    
    halClient.$post(url, options, form).then (login) =>
      if login.$has('administrator')
        login.$get('administrator').then (user) =>
          user = @setLogin(user)
          deferred.resolve(user)
      else if login.$has('administrators')
        login_model = new BBModel.Admin.Login(login)
        deferred.resolve(login_model)
      else
        deferred.reject("No admin account for login")
    , (err) =>
      if err.status == 400
        login = halClient.$parse(err.data)
        if login.$has('administrators')
          login_model = new BBModel.Admin.Login(login)
          deferred.resolve(login_model)
        else
          deferred.reject(err)
      else
        deferred.reject(err)
    deferred.promise


  ssoLogin: (options, data) ->
    deferred = $q.defer()
    url = $rootScope.bb.api_url + "/api/v1/login/sso/" + options['company_id']

    halClient.$post(url, {}, data).then (login) =>
      params = {auth_token: login.auth_token}
      login.$get('user').then (user) =>
        user = @setLogin(user)
        deferred.resolve(user)
    , (err) =>
      deferred.reject(err)
    deferred.promise
      

  isLoggedIn: ->
    @checkLogin()
    if $rootScope.user
      true
    else
      false


  setLogin: (user) ->
    auth_token = user.getOption('auth_token')
    user = new BBModel.Admin.User(user)
    $sessionStorage.setItem("user", user.$toStore())
    $sessionStorage.setItem("auth_token", auth_token)
    $rootScope.user = user
    user

  user: () ->
    @checkLogin()
    $rootScope.user

  checkLogin: () ->
    return if $rootScope.user

    user = $sessionStorage.getItem("user")
    if user
      $rootScope.user = halClient.createResource(user)

  logout: () ->
    $rootScope.user = null
    $sessionStorage.removeItem("user")
    $sessionStorage.removeItem("auth_token")

  getLogin: (options) ->
    defer = $q.defer()
    url = "#{$rootScope.bb.api_url}/api/v1/login/admin/#{options.company_id}"
    halClient.$get(url, options).then (login) =>
      if login.$has('administrator')
        login.$get('administrator').then (user) =>
          user = @setLogin(user)
          defer.resolve(user)
        , (err) ->
          defer.reject(err)
      else
        defer.reject()
    , (err) ->
      defer.reject(err)
    defer.promise

