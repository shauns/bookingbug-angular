app = angular.module 'BB.Directives'

# International Telephone Input directive
# http://www.tooorangey.co.uk/posts/that-international-telephone-input-umbraco-7-property-editor/
# https://github.com/Bluefieldscom/intl-tel-input
app.directive "intTelNumber", ->
  
  # Restrict it to being an attribute
  restrict: "A"
  
  link: (scope, element, attrs) ->

    options = scope.$eval attrs.intTelNumber
        
    # apply plugin
    element.intlTelInput options
      
    #validate loaded number
    # countryCode = element[0].nextSibling.children[0].children[0].className.split(" ")[1]
    # scope.validateTelephoneNumber element[0].value, countryCode
