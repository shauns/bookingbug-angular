'use strict';

# Directives
app = angular.module 'BB.Directives'

app.directive 'bbContent', ($compile) ->
  transclude: false,
  restrict: 'A',
  link: (scope, element, attrs) ->
    element.attr('ng-include',"bb_main")
    element.attr('ng-controller',"bbContentController")
    element.attr('onLoad',"initPage()")
    element.attr('bb-content',null)
    element.attr('ng-hide',"hide_page")
    $compile(element)(scope)


app.directive 'bbLoading', ($compile) ->
  transclude: false,
  restrict: 'A',
  link: (scope, element, attrs) ->
    scope.scopeLoaded = scope.areScopesLoaded(scope)
    element.attr('ng-hide',"scopeLoaded")
    element.attr('bb-loading',null)
    $compile(element)(scope)
    return


app.directive 'bbScrollTo', ($rootScope, AppConfig, BreadcrumbService) ->
  transclude: false,
  restrict: 'A',
  link: (scope, element, attrs) ->

    evnt = attrs.bbScrollTo
    always_scroll = attrs.bbAlwaysScroll? or false

    $rootScope.$on evnt, (e) ->
      if evnt == "page:loaded" && scope.display && scope.display.xs && $bbug('[data-scroll-id="'+AppConfig.uid+'"]').length
        scroll_to_element = $bbug('[data-scroll-id="'+AppConfig.uid+'"]')
      else
        scroll_to_element = $bbug(element)

      current_step = BreadcrumbService.getCurrentStep()

      # if the event is page:loaded or the element is not in view, scroll to it
      if ((evnt == "page:loaded" or not scroll_to_element.visible()) and current_step > 1) or always_scroll
        $bbug("html, body").animate
          scrollTop: scroll_to_element.offset().top
          , 500


# bbSlotGrouper
# group time slots together based on a given start time and end time
app.directive  'bbSlotGrouper', () ->
  restrict: 'A',
  require: ['^?bbTimeRanges?','^?bbTimes'],
  scope: true
  link: (scope, element, attrs) ->
    slots = scope.$eval(attrs.slots)
    return if !slots
    scope.grouped_slots = []
    for slot in slots
      scope.grouped_slots.push(slot) if slot.time >= scope.$eval(attrs.startTime) && slot.time < scope.$eval(attrs.endTime)
      scope.has_slots = scope.grouped_slots.length > 0


# bbForm
# Adds behaviour to select first invalid input 
# TODO more all form behaviour to this directive, initilising options as parmas
app.directive 'bbForm', () ->
  restrict: 'A'
  require: '^form'
  link: (scope, elem, attrs, ctrls) ->

    # set up event handler on the form element
    elem.on "submit", ->
      invalid_form_group = elem.find('.has-error:first')
      
      if invalid_form_group && invalid_form_group.length > 0
        $bbug("html, body").animate
          scrollTop: invalid_form_group.offset().top
          , 1000
        invalid_input      = invalid_form_group.find('.ng-invalid')
        invalid_input.focus()
        return false
      return true
