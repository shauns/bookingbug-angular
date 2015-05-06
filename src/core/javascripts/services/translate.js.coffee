angular.module('pascalprecht.translate').config ($translateProvider) ->

  en_translations = {
    MAP_TITLE: 'Search for a store to begin your booking.',
    MAP_PLACEHOLDER: 'Enter a town, city, postcode or showroom',
    PROGRESS_BAR_TITLE: 'Step'
    PROGRESS_BACK: 'Back'
    PROGRESS_NEXT: 'Continue'
    STORE_PHONE: 'Phone:'
    STORE_RESULT_TITLE: '{{number}} results for showrooms near {{address}}'
    SHOWROOM: 'Showroom'
    SELECT: 'Select'
    TIMESLOT_TITLE: 'Select a date and time for your Colour Consultation'
    APPOINTMENT_DATE: 'Date'
    APPOINTMENT_TIME: 'Time'
    APPOINTMENT_DURATION: 'Duration'
    MORNING: 'Morning'
    AFTERNOON: 'Afternoon'
    EVENING: 'Evening'
    NUMBER_OF_SLOTS: '{{number}} available'
    REVIEW_TITLE: 'Review your appointment details'
    DETAILS_TITLE: 'Your details',
    DETAILS_FIRST_NAME: 'First Name'
    DETAILS_FIRST_NAME_VALIDATION_MSG: 'Please enter your first name'
    DETAILS_LAST_NAME: 'Last Name'
    DETAILS_LAST_NAME_VALIDATION_MSG: 'Please enter your last name'
    DETAILS_EMAIL: 'E-mail'
    DETAILS_EMAIL_VALIDATION_MSG: 'Please enter a valid email address'
    DETAILS_PHONE: 'Mobile'
    DETAILS_PHONE_VALIDATION_MSG: 'Please enter a valid mobile number'
    DETAILS_TERMS: 'I agree to the terms and conditions'
    DETAILS_VALIDATION_MSG: 'This field is required'
    DETAILS_REQUIRED: 'Required'
    DETAILS_OTHER_INFO: 'Other information'
    PROGRESS_CONFIRM: 'Confirm'
    CONFIRMATION_TITLE: 'Booking Confirmation'
    PROGRESS_BAR_COMPLETE: 'Completed'
    CONFIRMATION_SUBHEADER: 'Thanks {{member_name}}. Your booking is now confirmed. We have emailed you the details below.'
    PRINT: 'Print'
    CALENDAR_EXPORT_TITLE: 'Export to calendar'
    BOOKING_REFERENCE: 'Booking Reference'
    SERVICE: 'Service'
    SERVICE_NAME: '{{service}} at {{company}}'
    SERVICE_CONFIRMATION: 'Colour Consultation at'
    DATE_TIME_CONFIRMATION: 'Date/Time'
    CONFIRMATION_INSPIRATION_LINK: 'Visit our inspiration site'
    CONFIRMATION_HOMEPAGE_LINK: 'Return to the homepage'
    SEARCH: 'Search'
    GEOLOCATE: 'Use current location'
    PICK_A_DATE: 'Pick a date'
    HOUR: 'hour'
    MIN: 'min'
    AND: 'and'
    MOVE_BOOKING: 'Move booking'
    EN: 'English'
    DE: 'Deutsch'
    FR: 'Français'
    CANCEL_QUESTION: 'Are you sure you want to cancel this booking?'
    WHEN: 'When'
    WHERE: 'Where'
    CANCEL_BOOKING: 'Cancel Booking'
    CANCEL_CANCEL: 'Do not cancel'
    OK: 'OK'
    BOOKING_DETAILS: 'Booking Details'
    MOVE_BOOKING: 'Move Booking'
    CANCEL_CONFIRMATION: 'Your booking has been cancelled.'
    CHANGE_LANG: 'Change language'
    ERROR: {
      GENERIC: "Sorry, it appears that something went wrong. Please try again or call the business you're booking with if the problem persists."
      LOCATION_NOT_FOUND: "Sorry, we don't recognise that location"
      MISSING_LOCATION: "Please enter your location"
      MISSING_POSTCODE: "Please enter a postcode"
      INVALID_POSTCODE: "Please enter a valid postcode"
      ITEM_NO_LONGER_AVAILABLE: "Sorry. The item you were trying to book is no longer available. Please try again."
      FORM_INVALID: "Please complete all required fieldsssss"
      GEOLOCATION_ERROR: "Sorry, we could not determine your location. Please try searching instead."
      EMPTY_BASKET_FOR_CHECKOUT: "There are no items in the basket to proceed to checkout."
    }
  }

  de_translations = {
    GEOLOCATE: 'Aktuellen Standort benutzen'
    MAP_TITLE: 'Suchen Sie nach einem Geschäft, um Ihre Reservierung zu beginnen.',
    MAP_PLACEHOLDER: 'Geben Sie eine Stadt , Stadt, Postleitzahl oder Ausstellungsraum'
    PROGRESS_BAR_TITLE: 'Schritt'
    STORE_PHONE: 'Telefon:'
    STORE_RESULT_TITLE: '{{number}} Ergebnisse für Geschäfte in der Nähe {{address}}'
    SEARCH: 'Suche'
    SELECT: 'wählen'
    TIMESLOT_TITLE: 'Test'

  }

  fr_translations = {
    PROGRESS_BAR_TITLE: 'étape'
  }

  $translateProvider
    .translations('en', en_translations)
    .translations('de', de_translations)
    .translations('fr', fr_translations)
    .determinePreferredLanguage () ->
      language = navigator.languages[0] or navigator.language or navigator.browserLanguage or navigator.systemLanguage or navigator.userLanguage or 'en'
      language.substr(0,2)
    .fallbackLanguage('en')
    .useCookieStorage()


angular.module('BB.Directives').directive 'bbTranslate', ($translate, $rootScope) ->
  restrict: 'AE'
  scope : false
  link: (scope, element, attrs) ->

    scope.languages = [{name: 'en', key: 'EN'}, {name: 'de', key: 'DE'}, {name: 'fr', key: 'FR'}]

    $rootScope.connection_started.then ->
      scope.selected_language = _.findWhere(scope.languages, {name: $translate.storage().get($translate.storageKey())})
      moment.locale(scope.selected_language.name) if scope.selected_language

    scope.changeLanguage = (language) ->
      return if !language
      scope.selected_language = language
      moment.locale(language.name)
      $translate.use(language.name)
      # restart the widget 
      scope.clearBasketItem()
      scope.emptyBasket()
      scope.restart()
      

angular.module('BB.Directives').directive 'bbTimePeriod', ($translate) ->
  restrict: 'AE'
  scope : true
  link: (scope, element, attrs) ->

    scope.duration = scope.$eval attrs.bbTimePeriod

    return if !angular.isNumber scope.duration

    $translate(['HOUR', 'MIN', 'AND']).then (translations) ->
      hour_string = translations.HOUR
      min_string  = translations.MIN
      seperator   = translations.AND

      val = parseInt(scope.duration)
      if val < 60
        scope.duration = "#{val} #{min_string}s"
        return
      hours = parseInt(val / 60)
      mins = val % 60
      if mins == 0
        if hours == 1
          scope.duration = "1 #{hour_string}"
          return
        else
          scope.duration = "#{hours} #{hour_string}s"
          return
      else
        str = "#{hours} #{hour_string}"
        str += "s" if hours > 1
        if mins == 0
          scope.duration = str
          return
        else
          str += " #{seperator}" if seperator.length > 0
          str += " #{mins} #{min_string}s"
          scope.duration = str
          return
