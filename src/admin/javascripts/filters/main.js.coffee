'use strict';


bbAdminFilters = angular.module('BBAdmin.Filters', []);


bbAdminFilters.filter 'rag', ->
  (value, v1, v2) ->
   if (value <= v1)
      return "red"
    else if (value <=v2)
      return "amber"
    else
      return "green"


bbAdminFilters.filter 'time', ($window) ->
  (v) ->
    return $window.sprintf("%02d:%02d",Math.floor(v/60), v%60 )
