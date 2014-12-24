angular.module('BBAdminServices').directive 'serviceTable', (AdminCompanyService,
		AdminServiceService, $modal, $log, ModalForm) ->

	controller = ($scope) ->

		$scope.getServices = () ->
			params =
				company: $scope.company
			AdminServiceService.query(params).then (services) ->
				console.log services
				$scope.services_models = services
				$scope.services = _.map services, (service) ->
					_.pick service, 'id', 'name'

		$scope.newService = () ->
			ModalForm.new
				company: $scope.company
				title: 'New Service'
				new_rel: 'new_service'
				post_rel: 'services'
				success: (service) ->
					$scope.services.push(service)

		$scope.delete = (id) ->
			service = _.find $scope.services_models, (s) -> s.id == id
			service.$del('self').then () ->
				$scope.services = _.reject $scope.services, (s) -> s.id == id
			,	(err) ->
				$log.error "Failed to delete service"

		$scope.edit = (id) ->
			service = _.find $scope.services_models, (s) -> s.id == id
			ModalForm.edit
				model: service
				title: 'Edit Service'

	link = (scope, element, attrs) ->
		if scope.company
			scope.getServices()
		else
			AdminCompanyService.query(attrs).then (company) ->
				scope.company = company
				scope.getServices()

	{
		controller: controller
		link: link
		templateUrl: 'service_table_main.html'
	}
