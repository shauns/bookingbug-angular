'use strict';




angular.module('BBAdmin.Directives').directive 'bbTabletNote', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletNote'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletNote', ($scope,  $rootScope, $q, $state, AdminBookingService, AlertService) ->

  $scope.goBack = () =>
    window.history.back()

  $rootScope.connection_started.then ->
    $scope.notLoaded $scope
    prms = {company_id: $scope.bb.company_id, id: $scope.booking_id}
    prms.url = $scope.bb.api_url

    AdminBookingService.getBooking(prms).then (booking) ->      
      $scope.booking = booking
      $scope.note = (booking.notes.private.filter (i) -> i.id == parseInt($scope.note_id))[0] if $scope.note_id?
      $scope.note ?= { note: '' }
      $scope.setLoaded $scope

    $scope.save_note = ->
      if $scope.note.id?
        prms.id = $scope.note.id
        AdminBookingService.updatePrivateNoteForBooking(prms, $scope.booking, $scope.note).then () ->
          window.history.back()
      else
        AdminBookingService.addPrivateNoteToBooking(prms, $scope.booking, $scope.note).then () ->
          window.history.back()
