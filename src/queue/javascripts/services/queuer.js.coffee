angular.module('BBQueue.Services').factory 'QueuerService', ($q, $window, halClient, BBModel) ->

	query: (params) ->
		deferred = $q.defer()

		url = ""
		url = params.url if params.url
		href = url + "/api/v1/queuers/{id}"
		uri = new $window.UriTemplate.parse(href).expand(params || {})

		halClient.$get(uri, {}).then (found) =>
			deferred.resolve(found)

		deferred.promise

	removeFromQueue: (params) ->
		deferred = $q.defer()

		url = ""
		url = params.url if params.url
		href = url + "/api/v1/queuers/{id}/destroy"
		uri = new $window.UriTemplate.parse(href).expand(params || {})

		halClient.$get(uri, {}).then (found) =>
			deferred.resolve(found)

		deferred.promise

