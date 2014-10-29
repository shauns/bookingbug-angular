
angular.module('BBAdmin.Controllers').controller 'DashboardContainer', ($scope,  $rootScope, $location, $modal) ->

  $scope.selectedBooking = null
  $scope.poppedBooking = null

  $scope.selectBooking = (booking) ->
    $scope.selectedBooking = booking

  $scope.popupBooking = (booking) ->
    $scope.poppedBooking = booking

    modalInstance = $modal.open {
      templateUrl: 'full_booking_details',
      controller: ModalInstanceCtrl,
      scope: $scope,
      backdrop: true,
      resolve: {
        items: () => {booking: booking};
      }
    }
    
    modalInstance.result.then (selectedItem) =>
      $scope.selected = selectedItem;
    , () =>
      console.log('Modal dismissed at: ' + new Date())

  ModalInstanceCtrl = ($scope, $modalInstance, items) ->
    angular.extend($scope, items)
    $scope.ok = () ->
      console.log "closeing", items,
      if items.booking && items.booking.self
        items.booking.$update()
      $modalInstance.close();
    $scope.cancel = () ->
      $modalInstance.dismiss('cancel');

  # a popup performing an action on a time, possible blocking, or mkaing a new booking
  $scope.popupTimeAction = (prms) ->
    console.log(prms)

    modalInstance = $modal.open {
      templateUrl: $scope.partial_url + 'time_popup',
      controller: ModalInstanceCtrl,
      scope: $scope,
      backdrop: false,
      resolve: {
        items: () => prms;
      }
    }
    