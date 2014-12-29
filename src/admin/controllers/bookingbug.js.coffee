angular.module('BBAdmin.Controllers').controller 'BBAdminCtrl', ($controller,
    $scope, $location, $rootScope, halClient, $window, $http, $localCache, $q,
    BasketService, LoginService, AlertService, $sce, $element, $compile,
    $sniffer, $modal, $timeout, BBModel, BBWidget, SSOService, ErrorService,
    AppConfig, BookingCollections, SlotCollections, $state, AdminLoginService, 
    AdminBookingService, $sessionStorage, $log, idleTimeout) ->

  angular.extend this, $controller 'BBCtrl',
    $scope        : $scope
    $location     : $location
    $rootScope    : $rootScope
    $window       : $window
    $http         : $http
    $localCache   : $localCache
    $q            : $q
    halClient     : halClient
    BasketService : BasketService
    LoginService  : LoginService
    AlertService  : AlertService
    $sce          : $sce
    $element      : $element
    $compile      : $compile
    $sniffer      : $sniffer
    $modal        : $modal
    $timeout      : $timeout
    BBModel       : BBModel
    BBWidget      : BBWidget
    SSOService    : SSOService
    ErrorService  : ErrorService
    AppConfig     : AppConfig
    $sessionStorage : $sessionStorage

  $scope.loggedInDef = $q.defer()
  $scope.logged_in = $scope.loggedInDef.promise
  $scope.nativeDate = Modernizr.inputtypes.date && Modernizr.touch
  $rootScope.bb = $scope.bb

  $scope.old_init = (prms) =>
    comp_id = prms.company_id

    if comp_id
      $scope.bb.company_id = comp_id
      $scope.channel_name = "private-company-" + $scope.bb.company_id

  #    $scope.pusher_channel = pusher.subscribe($scope.channel_name);
  #    var ds = $scope;

#      $scope.pusher_channel.bind('add', function(data) {
 #       $rootScope.$broadcast("Add_" + ds.type, data);
 #     });



   $scope.$on 'newCheckout', (event, total) =>
    if total.$has('admin_bookings') && BookingCollections.count() > 0
      total.$get('admin_bookings').then (bookings) ->
        for booking in bookings
          b = new BBModel.Admin.Booking(booking)
          BookingCollections.checkItems(b)
    if total.$has('admin_slots') && SlotCollections.count() > 0
      total.$get('admin_slots').then (slots) ->
        for slot in slots
          s = new BBModel.Admin.Slot(slot)
          SlotCollections.checkItems(s)


  $scope.$on '$stateChangeStart', (event, toState, toStateParams) ->
    unless toState.name == "login"
      AdminLoginService.checkLogin()
      unless AdminLoginService.isLoggedIn()
        $timeout () ->
          $state.go 'login'
      else
        company_id = AdminLoginService.user().company_id
        unless $scope.init_widget_started
          $scope.initWidget({company_id: company_id})
          
  $scope.pusherSubscribe = () =>
    if $scope.bb.company? && Pusher?
      if !$scope.pusher?
        $scope.pusher = new Pusher 'c8d8cea659cc46060608',
          authEndpoint: "/api/v1/push/#{$scope.bb.company_id}/pusher.json"
          auth:
            headers:
              # These should be put somewhere better - any suggestions?
              'App-Id' : 'f6b16c23'
              'App-Key' : 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
              'Auth-Token' : $sessionStorage.getItem('auth_token')
      
      channelName = "private-c#{$scope.bb.company.id}-w#{$scope.bb.company.numeric_widget_id}"
      
      if !$scope.pusher.channel(channelName)?
        $scope.pusher_channel = $scope.pusher.subscribe channelName
      
        pusherEvent = (res) =>
          if res.id?
            setTimeout (->
              prms = 
                company_id: $scope.bb.company_id
                id: res.id
                url: $scope.bb.api_url
              AdminBookingService.getBooking(prms).then (booking) ->
                return
            ), 2000

        $scope.pusher_channel.bind 'booking', pusherEvent
        $scope.pusher_channel.bind 'cancellation', pusherEvent
        $scope.pusher_channel.bind 'updating', pusherEvent
          
  $rootScope.$on 'company:setup',$scope.pusherSubscribe


  $scope.$on '$idleStart', () ->
    if AdminLoginService.isLoggedIn()
      $log.info "User is idle"
      $scope.idleModal = $modal.open
        template: """
<div class="modal-body">
  <p><div easypiechart options="options" percent="idle_percent" class="text-center"></p>
  <p class="text-center">You will be automatically logged out after {{timeout_minutes}} minutes of inactivity</p>
</div>
        """
        controller: ($scope, $modalInstance, idleStart, idleTimeout) ->
          $scope.options =
            lineWidth: 20
            barColor: '#000000'
            lineCap: 'circle'
          timeout = idleStart + idleTimeout
          $scope.timeout_minutes = Math.floor(timeout / 60)
          $scope.idle_percent = 100 - 100 * idleStart/timeout
          $scope.$on '$idleWarn', (e, countdown) ->
            idle_time = timeout + idleStart - countdown
            $scope.idle_percent = 100 - 100 * idle_time/timeout
            $log.info "User has been idle for #{idle_time} seconds"

  $scope.$on '$idleTimeout', () ->
    if AdminLoginService.isLoggedIn()
      $log.info "User session timeout"
      if $scope.idleModal
        $scope.idleModal.dismiss()
      $timeout () ->
        $state.go 'login'

  $scope.$on '$keepalive', () ->
    if $scope.idleModal
      $scope.idleModal.dismiss()
