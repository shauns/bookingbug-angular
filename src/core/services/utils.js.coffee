angular.module('BB').config ($logProvider, $injector) ->
    $logProvider.debugEnabled true

angular.module('BB.Services').factory "DebugUtilsService",
($rootScope, $location, $window, $log, BBModel) ->
  # logs a scopes key names and values
  logObjectKeys = (obj, showValue) ->
    for key, value of obj
      # dont show angular scope methods
      if obj.hasOwnProperty(key) and not _.isFunction(value) and not (/^\$\$/.test(key))
        console.log key
        if showValue
          console.log '\t', value, '\n'
    return


  showScopeChain = ->
    $root = $('[ng-app]')
    data = $root.data()

    if data && data.$scope
      f = (scope) ->
        console.log scope.$id;
        console.log scope;

        if scope.$$nextSibling
          f scope.$$nextSibling
        else
          if scope.$$childHead
            f scope.$$childHead

      f data.$scope
    return

    displayScopeInfo () ->


  do ->
    if ($location.host() is 'localhost' or $location.host() is '127.0.0.1') and $location.port() is 3000
      window.setTimeout ->
        scope = $rootScope
        # look for BBCtrl scope object and store it in memory
        while scope
          if scope.controller is 'public.controllers.BBCtrl'
            break
          scope  = scope.$$childHead


        # display the element, scope and controller for the selected element
        $($window).on 'dblclick', (e)->
          scope = angular.element(e.target).scope();
          controller = scope.hasOwnProperty('controller')
          pscope = scope

          if controller
            controllerName = scope.controller

          while !controller
            pscope = pscope.$parent
            controllerName = pscope.controller
            controller = pscope.hasOwnProperty('controller')

          $window.bbScope = scope
          $log.log e.target
          $log.log $window.bbScope
          $log.log 'Controller ->', controllerName



        # displays the key names on the BBCtrl scope. handy to see what's been
        # stuck on the scope. if 'prop' is true it will also display properties
        $window.bbBBCtrlScopeKeyNames = (prop) ->
          logObjectKeys scope, prop

        # displays the BBCtrl scope object
        $window.bbBBCtrlScope = ->
          scope

        # displays the $scope.current_item object, which is stored on the BBCtrl
        # scope
        $window.bbCurrentItem = ->
          scope.current_item

        # displays the currentItem Object
        $window.angular.bbShowScopeChain = showScopeChain

      ,10

  {
    logObjectKeys : logObjectKeys
  }

