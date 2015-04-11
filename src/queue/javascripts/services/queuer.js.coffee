angular.module('BBQueue.Services').factory 'QueuerService', ($q, $window, halClient, QueuerCollections, BBModel) ->

	query: (params) ->
		deferred = $q.defer()

		url = ""
		url = params.url if params.url
		href = url + "/api/v1/{company_id}/queuers/{id}"
		uri = new $window.UriTemplate.parse(href).expand(params || {})

		halClient.$get(uri, {}).then (found) =>
			deferred.resolve(found)
