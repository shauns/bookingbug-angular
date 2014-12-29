'use strict'

angular.module('BB.Models').factory "Admin.LoginModel", ($q, BBModel, BaseModel) ->

  class Admin_Login extends BaseModel

    constructor: (data) ->
      super(data)
