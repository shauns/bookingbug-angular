


angular.module('BB.Directives').directive 'bbPurchase', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'Purchase'
  link : (scope, element, attrs) ->
    scope.init(scope.$eval( attrs.bbPurchase ))
    return

angular.module('BB.Controllers').controller 'Purchase', ($scope,  $rootScope,
    CompanyService, PurchaseService, ClientService, $modal, $location, $timeout,
    BBWidget, BBModel, $q, QueryStringService, SSOService, AlertService,
    LoginService, $window, $upload, ServiceService, $sessionStorage) ->

  $scope.controller = "Purchase"

  setPurchaseCompany = (company) ->
    $scope.bb.company_id = company.id
    $scope.bb.company = new BBModel.Company(company)
    $scope.company = $scope.bb.company 
    $scope.bb.item_defaults.company = $scope.bb.company
    if company.settings
      $scope.bb.item_defaults.merge_resources = true if company.settings.merge_resources
      $scope.bb.item_defaults.merge_people    = true if company.settings.merge_people

  failMsg = () ->
    if $scope.fail_msg
      AlertService.danger({msg:$scope.fail_msg})
    else
      AlertService.danger({msg:"Sorry, something went wrong"})

  $scope.init = (options) ->
    if options.move_route
      $scope.move_route = options.move_route

    if options.move_all
      $scope.move_all = options.move_all

    if options.login_redirect
      $scope.requireLogin({redirect: options.login_redirect})
    $scope.notLoaded $scope
    $scope.fail_msg = options.fail_msg if options.fail_msg
    if options.member_sso
      SSOService.memberLogin(options).then (login) ->
        $scope.load()
      , (err) ->
        $scope.setLoaded $scope
        failMsg()
    else
      $scope.load()

  $scope.load = (id) ->
    $scope.notLoaded $scope
    id ||= QueryStringService('ref')
    if QueryStringService('booking_id')
      id = QueryStringService('booking_id')
    unless $scope.loaded
      $rootScope.widget_started.then () =>
        $scope.waiting_for_conn_started.then () =>
          company_id = getCompanyID()
          if company_id
            CompanyService.query(company_id, {}).then (company) ->
              setPurchaseCompany(company)
          params = {purchase_id: id, url_root: $scope.bb.api_url}
          auth_token = $sessionStorage.getItem('auth_token')
          params.auth_token = auth_token if auth_token
          PurchaseService.query(params).then (purchase) ->
            unless $scope.bb.company?
              purchase.$get('company').then (company) =>
                setPurchaseCompany(company)
            $scope.purchase = purchase
            $scope.total = $scope.purchase
            $scope.price = !($scope.purchase.price == 0)


            $scope.purchase.getBookingsPromise().then (bookings) ->
              $scope.bookings = bookings
              $scope.setLoaded $scope
              checkIfMoveBooking(bookings)

              for booking in $scope.bookings
                booking.getAnswersPromise().then (answers) ->
                  booking.answers = answers
  #                for answer in answers
  #                  answer.getQuestion().then (question) ->
  #                    answer.question = question
            , (err) ->
              $scope.setLoaded $scope
              failMsg()

            if purchase.$has('client')
              purchase.$get('client').then (client) =>
                $scope.setClient(new BBModel.Client(client))
            $scope.purchase.getConfirmMessages().then (messages) ->
              $scope.messages = messages
          , (err) ->
            $scope.setLoaded $scope
            if err && err.status == 401 && $scope.login_action
              if LoginService.isLoggedIn()
                failMsg()
              else
                loginRequired()
            else
              failMsg()
        , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')

    $scope.loaded = true


  checkIfMoveBooking = (bookings) ->
    matches = /^.*(?:\?|&)move_booking=(.*?)(?:&|$)/.exec($location.absUrl())
    id = parseInt(matches[1]) if matches
    if id
      move_booking = (b for b in bookings when b.id == id)
      $scope.move(move_booking[0]) if move_booking.length > 0 && $scope.isMovable(bookings[0])

  $scope.requireLogin = (action) =>
    if _.isString action.redirect
      if action.redirect.indexOf('?') is -1
        div = '?'
      else
        div = '&'
      action.redirect += (div + 'ref=' + encodeURIComponent(QueryStringService('ref')))
    $scope.login_action = action


  loginRequired = () =>
    if $scope.login_action.redirect
      window.location = $scope.login_action.redirect

  getCompanyID = () ->
    matches = /^.*(?:\?|&)company_id=(.*?)(?:&|$)/.exec($location.absUrl())
    company_id = matches[1] if matches
    company_id

  getPurchaseID = () ->
    matches = /^.*(?:\?|&)id=(.*?)(?:&|$)/.exec($location.absUrl())
    unless matches
      matches = /^.*print_purchase\/(.*?)(?:\?|$)/.exec($location.absUrl())
    unless matches
      matches = /^.*print_purchase_jl\/(.*?)(?:\?|$)/.exec($location.absUrl())
    id = matches[1] if matches
    id

  $scope.move = (booking, route, options = {}) ->
    route ||= $scope.move_route
    if $scope.move_all
      return $scope.moveAll(route, options)

    $scope.notLoaded $scope
    $scope.clearPage()
    $scope.initWidget({company_id: booking.company_id, no_route: true})
    $timeout () =>
      $rootScope.connection_started.then () =>
        proms = []
        $scope.bb.moving_booking = booking
        $scope.quickEmptybasket()
        new_item = new BBModel.BasketItem(booking, $scope.bb)
        new_item.setSrcBooking(booking, $scope.bb)
        new_item.ready = false
        Array::push.apply proms, new_item.promises
        $scope.bb.basket.addItem(new_item)
        $scope.setBasketItem(new_item)

        $q.all(proms).then () ->
          $scope.setLoaded $scope
          $rootScope.$emit "booking:move"
          $scope.decideNextPage(route)
        , (err) ->
          $scope.setLoaded $scope
          failMsg()
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  # potentiall move all of the items in booking - move the whole lot to a basket
  $scope.moveAll = ( route, options = {}) ->
    route ||= $scope.move_route
    $scope.notLoaded $scope
    $scope.clearPage()
    $scope.initWidget({company_id: $scope.bookings[0].company_id, no_route: true})
    $timeout () =>
      $rootScope.connection_started.then () =>
        proms = []
        if $scope.bookings.length == 1
          $scope.bb.moving_booking = $scope.bookings[0]
        else
          $scope.bb.moving_booking = $scope.purchase

        $scope.quickEmptybasket()
        for booking in $scope.bookings
          new_item = new BBModel.BasketItem(booking, $scope.bb)
          new_item.setSrcBooking(booking)
          new_item.ready = false
          new_item.move_done = false
          Array::push.apply proms, new_item.promises
          $scope.bb.basket.addItem(new_item)
        $scope.bb.sortStackedItems() 

        $scope.setBasketItem($scope.bb.basket.items[0])
        $q.all(proms).then () ->
          $scope.setLoaded $scope
          $scope.decideNextPage(route)
        , (err) ->
          $scope.setLoaded $scope
          failMsg()
      , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')





  $scope.confirm_delete = () ->
    modalInstance = $modal.open
    modalInstance.booking.$del('self').then (service) =>
      modalInstance.close
      $rootScope.$emit "booking:cancelled"
    # , (err) ->
    #   window.location = "/404"

  $scope.delete = (booking) ->
    $scope.clearPage()
    modalInstance = $modal.open
      templateUrl: $scope.getPartial "cancel_modal"
      controller: ModalDelete
      resolve:
        booking: ->
          booking
    modalInstance.result.then (booking) ->
      booking.$del('self').then (service) =>
        $scope.bookings = _.without($scope.bookings, booking)

  $scope.cancel = ->
    modalInstance = $modal.open
    modalInstance.dismiss "cancel"

  $scope.isMovable = (booking) ->
    if booking.min_cancellation_time
      return moment().isBefore(booking.min_cancellation_time)
    booking.datetime.isAfter(moment())


  $scope.onFileSelect = (booking, $file, existing) ->
    $scope.upload_progress = 0
    console.log $file, booking, existing
    console.log 
    file = $file
    att_id = null
    att_id = existing.id if existing
    method = "POST"
    method = "PUT" if att_id
    $scope.upload = $upload.upload({
      url: booking.$href('attachments'),
      method: method,
      # headers: {'header-key': 'header-value'},
      # withCredentials: true, 
      data: {att_id: att_id},
      file: file, # or list of files: $files for html5 only
      # set the file formData name ('Content-Desposition'). Default is 'file' 
      # fileFormDataName: myFile, //or a list of names for multiple files (html5).
      # customize how data is added to formData. See #40#issuecomment-28612000 for sample code
      # formDataAppender: function(formData, key, val){}
    }).progress (evt) -> 
      if $scope.upload_progress < 100
        $scope.upload_progress = parseInt(99.0 * evt.loaded / evt.total)
    .success (data, status, headers, config) ->
      # file is uploaded successfully
      $scope.upload_progress = 100
      if data && data.attachments && booking
        booking.attachments = data.attachments
    #.error(...)
    #.then(success, error, progress); 
    #.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.

    # alternative way of uploading, send the file binary with the file's content-type.
    #   Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
    #   It could also be used to monitor the progress of a normal http post/put request with large data*/
    # $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.


  if $scope.bb.total
    $scope.load($scope.bb.total.long_id)
  else
    id = getPurchaseID()
    if id
      $scope.load(id)


  $scope.createBasketItem = (booking) ->
    item = new BBModel.BasketItem(booking, $scope.bb)
    item.setSrcBooking(booking)
    return item


  $scope.checkAnswer = (answer) ->
    typeof answer.value == 'boolean' || typeof answer.value == 'string' || typeof answer.value == "number"

# Simple Modal Controller For Handling the Delete Modal
ModalDelete = ($scope,  $rootScope, $modalInstance, booking) ->
  $scope.controller = "ModalDelete"
  $scope.booking = booking

  $scope.confirm_delete = () ->
    $modalInstance.close(booking)

  $scope.cancel = ->
    $modalInstance.dismiss "cancel"
