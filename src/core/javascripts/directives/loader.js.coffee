'use strict';

# Loader Directive

# Example usage;
# <div bb-loader>
# <div bb-loader="#someid">
# <div bb-loader=".someclass">

# classes or ids will be added to the loading item so they can be styled
# individually.

app = angular.module 'BB.Directives'

app.directive 'bbLoader', ($rootScope, $compile, PathSvc, TemplateSvc) ->
  restrict: 'A'
  replace : false
  scope : {}
  controllerAs : 'LoaderCtrl'
  controller : ($scope) ->
    # get parent scope's id as that is the element on which the 'bbLoader'
    # directive was applied. we can then act on all child scope events.
    parentScopeId = $scope.$parent.$id
    scopeIdArr = []

     # if scope which is emitting 'show:loader' event is child of this bbLoader
    # instance, then store it's id so we can check when it's finished loading.
    addScopeId = (id) ->
      # console.log 'add', id
      scopeIdArr.push id
      scopeIdArr = _.uniq scopeIdArr
      return


    # remove scope ids when they emit the 'hide:loader' event. return the array
    # length so we can see if we need to hide the loading icon.
    removeScopeId = (id) ->
      # console.log 'remove', id
      scopeIdArr = _.without scopeIdArr, id
      scopeIdArr.length


    # check to see if this instance of bbLoader is a parent of the scope which
    # has emitted the 'show:loader' event. if it is then show the loading
    # icon and store it's id.
    showLoader = (e, cscope) ->
      sid = cscope.$id;

      while cscope
        if cscope.$id is parentScopeId
          # store scope id so we can check when it's finished loading
          addScopeId sid
          # show loading icon
          $scope.scopeLoaded = false;
          break;
        cscope = cscope.$parent;
      return


    # check scopeid array. if it's empty then hide the loading icon. the
    # removeScopeId() function returns the array length
    hideLoader = (e, cscope) ->
      if (!removeScopeId cscope.$id)
        # console.log 'hide loading icon.'
        $scope.scopeLoaded = true;
        return

    # start listening for events emitted by other scopes
    $rootScope.$on 'show:loader', showLoader
    $rootScope.$on 'hide:loader', hideLoader
    # show loader by default
    $scope.scopeLoaded = false;
    return

  link: (scope, element, attrs) ->
    # we can't load the template using 'templateUrl' as this will alter the
    # element which contains the directive. we can't use transclusion on a
    # directive applied to the BBCrtl element as the controller contains most of
    # the app's logic and any transcluded content will use the scope of it's
    # parent and skip the BBCrtl. also translcuded content which contains ng-
    # init throws a js error and there is lots of that in the app. so for those
    # reasons we load the template manually and compile it.
    TemplateSvc.get(PathSvc.directivePartial "loader").then (html) ->
      # add the id or class attribute if there is one used with the directive
      if _.isString attrs.bbLoader
        str = attrs.bbLoader.slice 1

        if /^#/.test(attrs.bbLoader)
          html.attr('id', str)
        else if /^\./.test(attrs.bbLoader)
          html.addClass(str)

      element.prepend(html);
      $compile(html)(scope)
      return
    return




