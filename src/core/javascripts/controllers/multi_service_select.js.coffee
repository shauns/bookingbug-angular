'use strict';

angular.module('BB.Directives').directive 'bbMultiServiceSelect', () ->
  restrict: 'AE'
  scope : true
  controller : 'MultiServiceSelect'

angular.module('BB.Controllers').controller 'MultiServiceSelect',
($scope, $rootScope, $q, $attrs, BBModel, AlertService, CategoryService, FormDataStoreService) ->

  FormDataStoreService.init 'MultiServiceSelect', $scope, [
    'selected_category_name'
  ]

  $scope.options                    = $scope.$eval($attrs.bbMultiServiceSelect) or {}
  $scope.options.max_services       = $scope.options.max_services or 3
  $scope.options.ordered_categories = $scope.options.ordered_categories or false
  $scope.options.services           = $scope.options.services or 'items'

  # Get the categories
  CategoryService.query($scope.bb.company).then (items) =>
    for item in items
      if $scope.options.ordered_categories
        item.order = parseInt(item.name.slice(0,2))
        item.name  = item.name.slice(3)
    $scope.all_categories = _.indexBy(items, 'id')
  , (err) -> $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  # wait for items and all_categories before for we begin initialisation
  $scope.$watch $scope.options.services, (newval, oldval) ->
    if newval and angular.isArray(newval) and $scope.all_categories and !$scope.initialised
      $scope.items = newval
      initialise()
  $scope.$watch 'all_categories', (newval, oldval) ->
    if newval and angular.isArray(newval) and $scope.items and !$scope.initialised
      initialise()


  initialise = () ->

    $scope.initialised = true

    collectCategories()

    if ($scope.bb.basket and $scope.bb.basket.items.length > 0) || ($scope.bb.stacked_items and $scope.bb.stacked_items.length > 0)
      # if the basket already has some items, set the stacked items
      if $scope.bb.basket and $scope.bb.basket.items.length > 0 and $scope.bb.basket.items[0].service
        if !$scope.bb.stacked_items || $scope.bb.stacked_items.length == 0
          $scope.bb.setStackedItems($scope.bb.basket.items)

      # if there's already some stacked items (i.e. we've come back to this page,
      # make sure they're selected)
      if $scope.bb.stacked_items and $scope.bb.stacked_items.length > 0
        for stacked_item in $scope.bb.stacked_items
          for item in $scope.items
            if item.self is stacked_item.service.self
              stacked_item.service = item
              stacked_item.service.selected = true
              break
    else
      # check item defaults
      checkItemDefaults()

    if $scope.bb.moving_booking
      # if we're moving the booking just move to the next step
      $scope.nextStep()

    $scope.setLoaded $scope


  checkItemDefaults = () ->
    return if !$scope.bb.item_defaults.service
    for service in $scope.items
      if service.self is $scope.bb.item_defaults.service.self
        $scope.addItem(service)
        return


  collectCategories = () ->

    all_categories = _.groupBy($scope.items, (item) -> item.category_id)

    # filter categories that have no services
    categories = {}
    for own key, value of all_categories
      categories[key] = value if value.length > 0

    # group services by their sub category
    $scope.categories = []
    for category_id, services of categories
      sub_categories = _.groupBy(services, (service) -> service.extra.extra_category)

      category_details = {name: $scope.all_categories[category_id].name, description: $scope.all_categories[category_id].description} if $scope.all_categories[category_id]

      category = {
        name           : category_details.name 
        description    : category_details.description 
        sub_categories : sub_categories
        }
      category.order = $scope.all_categories[category_id].order if $scope.options.ordered_categories

      $scope.categories.push(category)

      if $scope.selected_category_name and $scope.selected_category_name is category_details.name
        $scope.selected_category = $scope.categories[$scope.categories.length - 1]
      else if $scope.bb.item_defaults.category and $scope.bb.item_defaults.category.name is category_details.name and !$scope.selected_category 
        $scope.selected_category = $scope.categories[$scope.categories.length - 1]
        $scope.selected_category_name = $scope.selected_category.name


  $scope.changeCategory = (category_name, services) ->

    if category_name and services
      $scope.selected_category = {
        name: category_name
        sub_categories: services
      }
      $scope.selected_category_name = $scope.selected_category.name
      $rootScope.$broadcast "multi_service_select:category_changed"


  $scope.changeCategoryName = () ->
      $scope.selected_category_name = $scope.selected_category.name
      $rootScope.$broadcast "multi_service_select:category_changed"


  $scope.addItem = (item) ->
    if $scope.bb.stacked_items.length < $scope.options.max_services
      $scope.bb.clearStackedItemsDateTime() # clear any selected date/time as the selection has changed
      item.selected = true
      iitem = new BBModel.BasketItem(null, $scope.bb)
      iitem.setDefaults($scope.bb.item_defaults)
      iitem.setService(item)
      iitem.setGroup(item.group)
      $scope.bb.stackItem(iitem)
      $rootScope.$broadcast "multi_service_select:item_added"
    else
      for i in $scope.items
        i.popover = "Sorry, you can only book a maximum of #{$scope.options.max_services} treatments"
        i.popoverText = i.popover


  $scope.removeItem = (item) ->
    item.selected = false
    $scope.bb.deleteStackedItem(item)
    $scope.bb.clearStackedItemsDateTime() # clear any selected date/time as the selection has changed
    $rootScope.$broadcast "multi_service_select:item_removed"
    for i in $scope.items
      if i.self is item.self
        i.selected = false
        break


  $scope.nextStep = () ->
    if $scope.bb.stacked_items.length > 1
      $scope.decideNextPage()
    else if $scope.bb.stacked_items.length == 1
      # first clear anything already in the basket and then set the basket item
      $scope.quickEmptybasket({preserve_stacked_items: true}) if $scope.bb.basket && $scope.bb.basket.items.length > 0
      $scope.setBasketItem($scope.bb.stacked_items[0])
      $scope.decideNextPage()
    else
      AlertService.clear()
      AlertService.add("danger", { msg: "You need to select at least one treatment to continue" })


  $scope.addService = () ->
    $rootScope.$broadcast "multi_service_select:add_item"


  $scope.setReady = () ->
    if $scope.bb.stacked_items.length > 1
      return true
    else if $scope.bb.stacked_items.length == 1
      # first clear anything already in the basket and then set the basket item
      $scope.quickEmptybasket({preserve_stacked_items: true}) if $scope.bb.basket && $scope.bb.basket.items.length > 0
      $scope.setBasketItem($scope.bb.stacked_items[0])
      return true
    else
      AlertService.clear()
      AlertService.add("danger", { msg: "You need to select at least one treatment to continue" })
      return false