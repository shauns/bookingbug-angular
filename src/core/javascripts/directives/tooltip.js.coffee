#  the default behavior for the 'click' event for the popover is to hide the
#  popover if the click occurs on the element but it doesn't hide if you click
#  anywhere else as the event has to occur on the element. so we add additional
#  check on the container to check if the popover is still open on a click
#  event. clearly this will fail if the event propogation is stopped in the
#  code, but that is bad practise so shouldn't be happening.
angular.module('BB.Directives').directive 'popover', () ->
  openElement = null
  openScope = null

  $('div[ng-controller="BBCtrl"]').off('.bbtooltip').on 'click.bbtooltip', (e) ->
    target = $(e.target).closest('[popover]')[0]
    # if users clicks elsewhere, hide any open tooltip
    if !target and openElement and openScope
      $(openElement).next('.popover').remove()
      openScope.tt_isOpen = false;
    # return true unless coffeescript returns false which stops things working.
    return true


  return {
    restrict: 'EA',
    priority: -1000,
    link : (scope, element) ->
      element.on 'click.bbtooltip', (e) ->
        # do nothing if user clicks on the an element which is already
        # displaying a tooltip
        if openElement is $(e.target).closest('[popover]')[0]
          e.preventDefault()
          return

        # remove any open tooltips
        if openElement and openScope
          $(openElement).next('.popover').remove()
          openScope.tt_isOpen = false;
        # then store this element as the element with the open tooltip
        openElement = element[0]
        openScope = scope

      scope.$on '$destroy', ->
        $(element).off '.bbtooltip'
  }