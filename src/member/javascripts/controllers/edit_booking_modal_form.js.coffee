angular.module('BBMember').controller 'editBookingModalForm', ($scope,
    $modalInstance, $log, booking) ->

  $scope.title = 'Booking Details'
  booking.$get('edit_booking').then (booking_schema) ->
    $scope.form = booking_schema.form
    $scope.schema = booking_schema.schema
    booking.getAnswersPromise().then (answers) ->
      for answer in answers.answers
        booking["question#{answer.question_id}"] = answer.value
      $scope.booking = booking

  $scope.submit = (booking) ->
    $scope.booking.$put('self', {}, booking).then (booking) ->
      $log.info "Booking update success"
      $modalInstance.close($scope.booking)
    , (err) ->
      $log.error "Booking update failure"

  $scope.cancel = () ->
    $modalInstance.dismiss('cancel')
