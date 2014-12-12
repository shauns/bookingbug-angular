angular.module('BB.Services').factory 'PathSvc', ($sce, AppConfig) ->
  directivePartial : (fileName) ->
    if AppConfig.partial_url
      partial_url = AppConfig.partial_url
      $sce.trustAsResourceUrl("#{partial_url}/#{fileName}.html")
    else
      $sce.trustAsResourceUrl("#{fileName}.html")
