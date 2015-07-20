angular.module('BBAdminBooking').factory 'AdminBookingPopup', ($modal, $timeout) ->

  open: (config) ->
    $modal.open
      controller: ($scope, config) ->
        $scope.config = angular.extend
          company_id: $scope.company.id
          item_defaults:
            merge_resources: true
            merge_people: true
          clear_member: true
          template: 'main'
        , config
      templateUrl: 'admin_booking_popup.html'
      resolve:
        config: () -> config
