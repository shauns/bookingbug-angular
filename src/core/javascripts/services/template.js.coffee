# Service for loading templates and partials. return rasterized dom elements
angular.module('BB.Services').factory "TemplateSvc", ($q, $http, $templateCache, BBModel) ->
  get: (path) ->
    deferred = $q.defer()
    cacheTmpl = $templateCache.get(path);

    if cacheTmpl
      deferred.resolve(angular.element(cacheTmpl))
    else
      $http
        method: 'GET'
        url: path
      .success (tmpl, status) ->
        $templateCache.put(path, tmpl);
        deferred.resolve(angular.element(tmpl))
      .error (data, status) ->
        deferred.reject data
    deferred.promise

