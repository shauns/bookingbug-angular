'use strict';


angular.module('BBAdmin.Directives').directive 'bbTabletOutcomes', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'TabletOutcomes'
  link : (scope, element, attrs) ->
    return


angular.module('BBAdmin.Controllers').controller 'TabletOutcomes', ($scope,
    $rootScope, $q, AdminBookingService, ValidatorService, BBModel, $state, 
    $filter) ->
      
  setAnswer = (a) ->
    defer = $q.defer()
    a.getQuestionPromise().then (q) ->
      q.answer = a.value
      defer.resolve(q)
    defer.promise
  
  $scope.hasOutcomes = false
  $scope.validator = ValidatorService
  $scope.notLoaded $scope

  $rootScope.connection_started.then ->
  
    prms =
      company_id: $scope.bb.company_id,
      id: $scope.booking_id,
      url: $scope.bb.api_url
    
    AdminBookingService.getBooking(prms).then (booking) ->
      booking.getAnswersPromise().then (answers) ->
        answers = (new BBModel.Answer(a) for a in answers.answers)
        outcomes = $filter('filter') answers, (answer) ->
          answer.value? && answer.admin_only

        $scope.hasOutcomes = outcomes.length > 0
        $scope.booking = booking
        $q.all((setAnswer(a) for a in answers)).then (questions) ->
          $scope.booking.questions = questions
          $scope.setLoaded $scope
          $scope.setPageLoaded()
  
  $scope.submit = () ->
    return false if !$scope.validator.validateForm($scope.outcomes_form)
    $scope.booking.$update()

    if $scope.hasOutcomes
      window.history.back()
    else
      window.history.go(-2)

  $scope.cancel = () ->
    window.history.back()
