angular.module('pascalprecht.translate').config ($translateProvider) ->

  en_translations = {

    CHANGE_LANG: 'Change language'
    EN: 'English'
    DE: 'Deutsch'
    FR: 'Français'

    PROGRESS_BAR_TITLE: 'Step'
    PROGRESS_BAR_COMPLETE: 'Completed'
    PROGRESS_BACK: 'Back'
    PROGRESS_CLEAR: 'Clear'
    PROGRESS_SEARCH: 'Search'
    PROGRESS_SELECT: 'Select'
    PROGRESS_CONFIRM: 'Confirm'
    PROGRESS_NEXT: 'Continue'
    PROGRESS_OK: 'OK'
    PROGRESS_MOVE_BOOKING: 'Move booking'
    PROGRESS_CANCEL_CANCEL: 'Do not cancel'
    PROGRESS_CANCEL_BOOKING: 'Cancel booking'

    MAP_TITLE: 'Search for a store to begin your booking.'
    MAP_PLACEHOLDER: 'Enter a town, city, postcode or showroom'
    GEOLOCATE: 'Use current location'
    STORE_RESULT_TITLE: '{{number}} results for showrooms near {{address}}'
    STORE_PHONE: 'Phone:'
    SHOWROOM: 'Showroom'    

    SERVICE: 'Service'
    SERVICE_NAME: '{{service}} at {{company}}'
    SERVICE_CONFIRMATION: '{item} at'
    DATE_TIME_CONFIRMATION: 'Date/Time'

    AVAIL_TITLE: 'Select a date and time for your Colour Consultation'
    APPOINTMENT_DATE: 'Date'
    APPOINTMENT_TIME: 'Time'
    APPOINTMENT_DURATION: 'Duration'
    AVAIL_DAY_PREVIOUS: 'Previous Day'
    AVAIL_DAY_NEXT: 'Next Day'
    AVAIL_MONTH_PREVIOUS: 'Previous Month'
    AVAIL_MONTH_NEXT: 'Next Month'
    AVAIL_MORNING: 'Morning'
    AVAIL_AFTERNOON: 'Afternoon'
    AVAIL_EVENING: 'Evening'
    AVAIL_SLOTS: '{{number}} available'

    PICK_A_DATE: 'Pick a date'
    HOUR: 'hour'
    MIN: 'min'
    AND: 'and'

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
    
    CONFIRMATION_TITLE: 'Booking Confirmation'
    CONFIRMATION_SUBHEADER: 'Thanks {{member_name}}. Your booking is now confirmed. We have emailed you the details below.'
    PRINT: 'Print'
    CALENDAR_EXPORT_TITLE: 'Export to calendar'
    BOOKING_REFERENCE: 'Booking Reference'
    CONFIRMATION_INSPIRATION_LINK: 'Visit our inspiration site'
    CONFIRMATION_HOMEPAGE_LINK: 'Return to the homepage'

    CANCEL_QUESTION: 'Are you sure you want to cancel this booking?'
    WHEN: 'When'
    WHERE: 'Where'
    BOOKING_DETAILS: 'Booking Details'
    CANCEL_CONFIRMATION: 'Your booking has been cancelled.'
    
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

    CHANGE_LANG: 'Sprache ändern'

    PROGRESS_BAR_TITLE: 'Schritt'
    PROGRESS_BAR_COMPLETE: 'fertiggestellt'
    PROGRESS_BACK: 'zurück'
    PROGRESS_CLEAR: 'klar'
    PROGRESS_SEARCH: 'Suche'
    PROGRESS_SELECT: 'wählen'
    PROGRESS_CONFIRM: 'bestätigen'
    PROGRESS_NEXT: 'fortsetzen'
    PROGRESS_OK: 'Ok'
    PROGRESS_MOVE_BOOKING: 'Verschieben Buchungs'
    PROGRESS_CANCEL_CANCEL: 'Stornieren Sie nicht' 
    PROGRESS_CANCEL_BOOKING: 'Reservierung stornieren'

    MAP_TITLE: 'Suchen Sie nach einem Geschäft, um Ihre Reservierung zu beginnen.'
    MAP_PLACEHOLDER: 'Geben Sie eine Stadt , Stadt, Postleitzahl oder Ausstellungsraum'
    GEOLOCATE: 'Aktuellen Standort benutzen'
    STORE_RESULT_TITLE: '{{number}} Ergebnisse für Geschäfte in der Nähe {{address}}'
    STORE_PHONE: 'Telefon:'

    SERVICE: 'Service'
    SERVICE_NAME: '{{item}} bei {{company}}'
    SERVICE_CONFIRMATION: '{{item}} at'
    DATE_TIME_CONFIRMATION: 'Datum / Uhrzeit'
    CONFIRMATION_INSPIRATION_LINK: 'Besuchen Sie unsere Website Inspiration'
    CONFIRMATION_HOMEPAGE_LINK: 'Zurück zur Startseite'

    AVAIL_TITLE: 'Wählen Sie ein Datum und die Uhrzeit für Ihre {{item}}'
    APPOINTMENT_DATE: 'Datum'
    APPOINTMENT_TIME: 'Zeite'
    APPOINTMENT_DURATION: 'Dauer'
    AVAIL_DAY_PREVIOUS: 'letzter Tag'
    AVAIL_DAY_NEXT: 'Nächster Tag'
    AVAIL_MONTH_PREVIOUS: 'Vorheriger Monat'
    AVAIL_MONTH_NEXT: 'Nächster Monat'
    AVAIL_MORNING: 'Morgen'
    AVAIL_AFTERNOON: 'Nachmittag'
    AVAIL_EVENING: 'Abend'
    AVAIL_SLOTS: '{{number}} verfügbar'

    PICK_A_DATE: 'Wählen Sie ein Datum'
    HOUR: 'Stunde'
    MIN: 'Minute'
    AND: 'und'

    REVIEW_TITLE: 'Überprüfen Sie Ihre Termindetails'
    DETAILS_TITLE: 'Ihre Angaben',
    DETAILS_FIRST_NAME: 'Vorname'
    DETAILS_FIRST_NAME_VALIDATION_MSG: 'Bitte geben Sie Ihren Vornamen ein'
    DETAILS_LAST_NAME: 'Nachname'
    DETAILS_LAST_NAME_VALIDATION_MSG: 'Bitte geben Sie Ihren Nachnamen ein'
    DETAILS_EMAIL: 'E-Mail-'
    DETAILS_EMAIL_VALIDATION_MSG: 'Bitte geben Sie eine gültige E-Mail-Adresse'
    DETAILS_PHONE: 'Handynummer'
    DETAILS_PHONE_VALIDATION_MSG: 'Bitte geben Sie eine gültige Handynummer ein'
    DETAILS_TERMS: 'Ich stimme den Geschäftsbedingungen'
    DETAILS_VALIDATION_MSG: 'Dieses Feld ist erforderlich'
    DETAILS_REQUIRED: 'erforderlich'
    DETAILS_OTHER_INFO: 'sonstige Angaben'

    CONFIRMATION_TITLE: 'Buchungsbestätigung'
    CONFIRMATION_SUBHEADER: 'dank {{member_name}}. Ihre Buchung ist nun bestätigt. Leider können wir Ihnen per E-Mail die Details unten.'
    PRINT: 'Druck'
    CALENDAR_EXPORT_TITLE: 'Export, um den Kalender'
    BOOKING_REFERENCE: 'Buchungsreferenz'
    CONFIRMATION_INSPIRATION_LINK: 'Besuchen Sie unsere Website Inspiration'
    CONFIRMATION_HOMEPAGE_LINK: 'Zurück zur Startseite'

    CANCEL_QUESTION: 'Sind Sie sicher, Sie wollen diesen Buchung stornieren?'
    WHEN: 'wann'
    WHERE: 'wo'
    BOOKING_DETAILS: 'Buchung Nähere'
    CANCEL_CONFIRMATION: 'Ihre Buchung storniert wurde.'
    
    ERROR: {
      GENERIC: "Leider scheint es, dass etwas schief gelaufen ist. Bitte versuchen Sie es erneut oder rufen Sie das Unternehmen sind Sie bei der Buchung mit, wenn das Problem weiterhin besteht."
      LOCATION_NOT_FOUND: "Leider haben wir nicht, dass die Lage erkennen"
      MISSING_LOCATION: "Bitte geben Sie Ihren Standort"
      MISSING_POSTCODE: "Bitte geben Sie eine Postleitzahl ein"
      INVALID_POSTCODE: "Bitte geben Sie eine gültige Postleitzahl an"
      ITEM_NO_LONGER_AVAILABLE: "Entschuldigung. Das Element, das Sie versuchten, zu buchen ist nicht mehr verfügbar. Bitte versuchen Sie es erneut."
      FORM_INVALID: "Bitte füllen Sie alle Felder aus"
      GEOLOCATION_ERROR: "Leider konnten wir Dein Ort wurde nicht festzustellen. Bitte versuchen Sie statt."
      EMPTY_BASKET_FOR_CHECKOUT: "Es sind keine Artikel im Warenkorb zur Kasse gehen."
    }

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
