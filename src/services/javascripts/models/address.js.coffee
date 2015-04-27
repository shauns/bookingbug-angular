'use strict';

angular.module('BB.Models').factory "Admin.AddressModel", ($q, BBModel, BaseModel, AddressModel) ->

  class Admin_Address extends AddressModel