angular.module('BBAdmin.Controllers').controller 'BBAdminCtrl',
($controller, $scope, $location, $rootScope, halClient, $window, $http, $localCache, $q, BasketService, LoginService,
 AlertService, $sce, $element, $compile, $sniffer, $modal, $timeout, BBModel, BBWidget, SSOService, ErrorService, AppConfig) ->

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

  $scope.loggedInDef = $q.defer()
  $scope.logged_in = $scope.loggedInDef.promise
  $rootScope.bb = $scope.bb
  console.log "for admin only 1 widget", $rootScope.bb

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

