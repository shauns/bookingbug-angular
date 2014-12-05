# Adapted from https://github.com/PM5544/scoped-polyfill

angular.module("BB.Directives").directive  'scoped', ($document, $timeout) ->

  @compat = do ->
    check = document.createElement('style')
    if typeof check.sheet != 'undefined'
      DOMStyle = 'sheet'
    else if typeof check.getSheet != 'undefined'
      DOMStyle = 'getSheet'
    else
      DOMStyle = 'styleSheet'
    scopeSupported = undefined != check.scoped
    document.body.appendChild(check)
    testSheet = check[DOMStyle]
    if testSheet.addRule
      testSheet.addRule('c', 'blink')
    else
      testSheet.insertRule('c{}', 0)
    DOMRules = if testSheet.rules then 'rules' else 'cssRules'
    testStyle = testSheet[DOMRules][0]
    try
      testStyle.selectorText = 'd'
    catch e
    changeSelectorTextAllowed = 'd' == testStyle.selectorText.toLowerCase()
    check.parentNode.removeChild(check)
    return {
      scopeSupported: scopeSupported
      rules: DOMRules
      sheet: DOMStyle
      changeSelectorTextAllowed: changeSelectorTextAllowed
    }

  scopeIt = (element) =>
    styleNode = element[0]
    idCounter = 0
    sheet = styleNode[@compat.sheet]
    return unless sheet
    allRules = sheet[@compat.rules]
    par = styleNode.parentNode
    id = par.id || (par.id = 'scopedByScopedPolyfill_' + ++idCounter)
    glue = ''
    index = allRules.length || 0
    while par
      if par.id then glue = '#' + par.id + ' ' + glue
      par = par.parentNode
    while index--
      rule = allRules[index]
      if rule.selectorText
        unless rule.selectorText.match(new RegExp(glue))
          selector = glue + ' ' + rule.selectorText.split(',').join(', ' + glue)
          selector = selector.replace(/[\ ]+:root/gi, '')
          if @compat.changeSelectorTextAllowed
            rule.selectorText = selector
          else
            if !rule.type || 1 == rule.type
              styleRule = rule.style.cssText
              if styleRule
                if sheet.removeRule
                  sheet.removeRule(index)
                else
                  sheet.deleteRule(index)
                if sheet.addRule
                  sheet.addRule(selector, styleRule)
                else
                  sheet.insertRule(selector + '{' + styleRule + '}', index)

  return {
    restrict: 'A'
    link: (scope, element, attrs) ->
      scope.scopeSupported = @compat.scopeSupported
      unless @compat.scopeSupported
        $timeout () ->
          scopeIt(element)
    controller: ($scope, $element, $timeout) ->
      unless $scope.scopeSupported
        @updateCss = () ->
          $timeout () ->
            scopeIt($element)
      return
  }
