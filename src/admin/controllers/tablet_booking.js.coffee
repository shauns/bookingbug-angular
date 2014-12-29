'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletBooking', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletBooking'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletBooking', ($scope,
    $rootScope, $q, AdminBookingService, BBModel, $state, $modal, $filter) ->

  $rootScope.connection_started.then ->
    $scope.notLoaded $scope
    prms = {company_id: $scope.bb.company_id, id: $scope.booking_id}
    prms.url = $scope.bb.api_url
    
    assignAnswers = (answers) =>
      $scope.booking.answers = answers
      $scope.answers = $filter('filter') $scope.booking.answers , (answer) ->
        answer.value? && !answer.admin_only
      $scope.outcomes = $filter('filter') $scope.booking.answers, (answer) ->
        answer.value? && answer.admin_only

    AdminBookingService.getBooking(prms).then (booking) ->
      booking.getAnswersPromise().then (answers) ->
        $scope.booking = booking
        assignAnswers(answers.answers)
        $scope.setLoaded $scope
        $scope.setPageLoaded()

    $scope.confirmCancel = ->
      modalInstance = $modal.open
        templateUrl: 'cancel-modal.html'

      modalInstance.result.then (result) =>
        if result
          $scope.notLoaded $scope
          AdminBookingService.cancelBooking(prms, $scope.booking).then (res) ->
            $scope.setLoaded $scope
            $state.go 'dashboard'

    $scope.confirmNoteDelete = (note) ->
      modalScope = $scope.$new(true)
      modalScope.note = note
    
      modalInstance = $modal.open
        templateUrl: 'delete-note-modal.html'
        scope: modalScope

      modalInstance.result.then (result) =>
        n_prms = { company_id: $scope.bb.company_id }
        if result
          $scope.notLoaded $scope
          AdminBookingService.deletePrivateNoteFromBooking(n_prms, $scope.booking, modalScope.note).then (booking) ->
            booking.getAnswersPromise().then (answers) ->
              $scope.booking = booking
              assignAnswers(answers)
              $scope.setLoaded $scope
              
      return false

  $scope.goBack = () =>
    window.history.back()
