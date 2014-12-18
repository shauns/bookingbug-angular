'use strict';

angular.module('BB.Models').factory "Admin.ServiceModel", ($q, BBModel, BaseModel) ->

  class Service extends BBModel.Service