angular.module('BB.Services').factory "ErrorService", [ ->

  errors = [
    {id: 1, type: 'GENERIC',                  title: '', msg: "Sorry, it appears that something went wrong. Please try again or call the business you're booking with if the problem persists."},
    {id: 2, type: 'LOCATION_NOT_FOUND',       title: '', msg: "Sorry, we don't recognise that location"},
    {id: 3, type: 'MISSING_LOCATION',         title: '', msg: 'Please enter your location'},
    {id: 4, type: 'MISSING_POSTCODE',         title: '', msg: 'Please enter a postcode'},
    {id: 5, type: 'INVALID_POSTCODE',         title: '', msg: 'Please enter a valid postcode'},
    {id: 6, type: 'ITEM_NO_LONGER_AVAILABLE', title: '', msg: 'Sorry. The item you were trying to book is no longer available. Please try again.'},
    {id: 7, type: 'FORM_INVALID',             title: '', msg: 'Please complete all required fields'},
    {id: 8, type: 'GEOLOCATION_ERROR',        title: '', msg: 'Sorry, we could not determine your location. Please try searching instead.'},
    {id: 9, type: 'EMPTY_BASKET_FOR_CHECKOUT',title: '', msg: 'There are no items in the basket to proceed to checkout.'} 
  ]

  getError: (type) ->
    for error in errors
      return error if error.type == type

    # if the error type wasn't found, return the generic error
    return errors[0]

]