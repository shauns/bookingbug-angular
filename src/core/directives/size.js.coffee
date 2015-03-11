app = angular.module 'BB.Directives'

app.directive 'bbDisplayMode', ($compile, $window) ->
  {
    transclude: false,
    restrict: 'A',
    template: '<span class="visible-xs"></span><span class="visible-sm"></span><span class="visible-md"></span><span class="visible-lg"></span>',
    link: (scope, elem, attrs) ->
      markers = elem.find('span')
      $bbug(elem).addClass("bb-display-mode")
      scope.display = {}

      isVisible = (element) ->
        return element && element.style.display != 'none' && element.offsetWidth && element.offsetHeight

      getCurrentSize = () ->
        for element in markers
          if isVisible(element)
            return element.className[8..10]
          scope.display = {}
          scope.display[element.className[8..10]] = true
          return false

      update = () =>
        nsize = getCurrentSize()
        if nsize != @currentSize
          @currentSize = nsize
          scope.display.xs = false
          scope.display.sm = false
          scope.display.md = false
          scope.display.lg = false
          scope.display.not_xs = true
          scope.display.not_sm = true
          scope.display.not_md = true
          scope.display.not_lg = true

          scope.display[nsize] = true
          scope.display["not_" + nsize] = false

          return true
        return false

      t = null
      angular.element($window).bind 'resize', () =>
        window.clearTimeout(t)
        t = setTimeout () ->
          if update()
            scope.$apply()
        , 50

      angular.element($window).bind 'load', () =>
        if update()
          scope.$apply()
  }

