# there is a some sort of 'redraw' bug in IE with select menus which display
# more than one option and the options are dynamically inserted. So only some of
# the text is displayed in the option until the select element recieves focus,
# at which point all the text is disaplyed. comment out the focus() calls below
# to see what happens.
angular.module('BB.Directives').directive 'ngOptions', ($sniffer, $rootScope) ->
  restrict : 'A'
  link : (scope, el, attrs) ->
    size = parseInt attrs['size'], 10

    if !isNaN(size) and size > 1 and $sniffer.msie
      $rootScope.$on 'loading:finished', ->
        el.focus()
        $('body').focus()