'use strict';

angular.module('BB.Directives').directive 'bbItemDetails', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'ItemDetails'
  link : (scope, element, attrs) ->
    if attrs.bbItemDetails
      item = scope.$eval( attrs.bbItemDetails )
      scope.loadItem(item)
    return


angular.module('BB.Controllers').controller 'ItemDetails',
($scope, $rootScope, ItemDetailsService, PurchaseBookingService, AlertService,
 BBModel, FormDataStoreService, ValidatorService, QuestionService, $modal, $location) ->

  $scope.controller = "public.controllers.ItemDetails"
  # stores data when navigating back/forward through the form
  FormDataStoreService.init 'ItemDetails', $scope, [
    'item_details'
  ]

  # populate object with values stored in the question store. addAnswersByName()
  # is good for populating a single object. for dynamic question/answers see
  # addDynamicAnswersByName()
  QuestionService.addAnswersByName($scope.client, [
    'first_name'
    'last_name'
    'email'
    'mobile'
  ])

  # '$scope.item_details' would only be on the scope if it's comes from the form
  # data store, which means the user has used the back/continue buttons
  $scope.notLoaded $scope
  $scope.validator = ValidatorService
  confirming = false

  $rootScope.connection_started.then ->
    $scope.product = $scope.bb.current_item.product
    if !confirming
      $scope.loadItem($scope.bb.current_item)

  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.loadItem = (item) ->
    confirming = true
    $scope.item = item
    if $scope.item.item_details
      setItemDetails $scope.item.item_details
      # this will add any values in the querystring
      QuestionService.addDynamicAnswersByName($scope.item_details.questions)
      $scope.recalc_price()
      $scope.setLoaded $scope
    else
      params = {company: $scope.bb.company, cItem: $scope.item}
      ItemDetailsService.query(params).then (details) ->
        setItemDetails details
        $scope.item.item_details = $scope.item_details
        $scope.recalc_price()
        $scope.setLoaded $scope
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    

  # compare the questions stored in the data store to the new questions and if
  # any of them match then copy the answer value. we're doing it like this as
  # the amount of questions can change based on selections made earlier in the
  # journey, so we can't just store the questions.
  setItemDetails = (details) ->
    if $scope.hasOwnProperty 'item_details'
      oldQuestions = $scope.item_details.questions

      _.each details.questions, (item) ->
        search = _.findWhere(oldQuestions, { name: item.name })
        if search
          item.answer = search.answer

    $scope.item_details = details



  $scope.recalc_price = ->
    qprice = $scope.item_details.questionPrice()
    bprice = $scope.item.base_price
    $scope.item.setPrice(qprice + bprice)


  $scope.confirm = (form, route) ->
    return if !ValidatorService.validateForm(form)
    # we need to validate the question information has been correctly entered here
    if $scope.bb.moving_booking
      return $scope.confirm_move(form, route)


    $scope.item.setAskedQuestions()
    if $scope.item.ready
      $scope.notLoaded $scope
      $scope.addItemToBasket().then () ->
        $scope.setLoaded $scope
        $scope.decideNextPage(route)
      , (err) ->
        $scope.setLoaded $scope
    else
      $scope.decideNextPage(route)


  $scope.setReady = () =>
    $scope.item.setAskedQuestions()
    if $scope.item.ready
      return $scope.addItemToBasket()
    else
      return true


  $scope.confirm_move = (form, route) ->
    confirming = true
    $scope.item ||= $scope.bb.current_item
   
    # we need to validate the question information has been correctly entered here
    $scope.item.setAskedQuestions()
    if $scope.item.ready
      $scope.notLoaded $scope
      PurchaseBookingService.update($scope.item).then (booking) ->
        b = new BBModel.Purchase.Booking(booking)
        if $scope.bookings
          for oldb, _i in $scope.bookings
            if oldb.id == b.id
              $scope.bookings[_i] = b

        $scope.purchase.bookings = $scope.bookings
        
        $scope.setLoaded $scope
        $scope.item.move_done = true
        $rootScope.$emit "booking:moved"
       , (err) =>
        $scope.setLoaded $scope
        AlertService.clear()
        AlertService.add("danger", { msg: "Failed to Move Booking" })

    else
      $scope.decideNextPage(route)


  $scope.openTermsAndConditions = () ->
    modalInstance = $modal.open(
      templateUrl: $scope.getPartial "terms_and_conditions"
      scope: $scope
    )


  $scope.getQuestion = (id) ->
    for question in $scope.item_details.questions
      return question if question.id == id

    return null


  $scope.updateItem = () ->
    $scope.item.setAskedQuestions()
    if $scope.item.ready
      $scope.notLoaded $scope

      PurchaseBookingService.update($scope.item).then (booking) ->

        b = new BBModel.Purchase.Booking(booking)
        if $scope.bookings
          for oldb, _i in $scope.bookings
            if oldb.id == b.id
              $scope.bookings[_i] = b

        $scope.purchase.bookings = $scope.bookings
        $scope.item_details_updated = true
        $scope.setLoaded $scope

       , (err) =>
        $scope.setLoaded $scope


  $scope.editItem = () ->
    $scope.item_details_updated = false


  # private methods
  setCommunicationPreferences: (value)->
    $scope.bb.current_item.settings.send_email_followup = value
    $scope.bb.current_item.settings.send_sms_followup   = value