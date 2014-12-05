angular.module('BB.Services').factory "BreadcrumbService",  () ->

  current_step = 1

  setCurrentStep: (step) ->
    current_step = step

  getCurrentStep: () ->
    return current_step
