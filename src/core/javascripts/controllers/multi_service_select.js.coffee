angular.module('BB.Directives').directive 'bbMultiServiceSelect', () ->
  restrict: 'AE'
  scope : true
  controller : 'MultiServiceSelect'

angular.module('BB.Controllers').controller 'MultiServiceSelect',
($scope, $rootScope, $q, $attrs, BBModel, AlertService, CategoryService, FormDataStoreService) ->

  FormDataStoreService.init 'MultiServiceSelect', $scope, [
    'selected_category'
  ]

  $scope.options = $scope.$eval($attrs.bbMultiServiceSelect) or {}
  $scope.options.max_services = $scope.options.max_services or 3

  # Get the categories
  CategoryService.query($scope.bb.company).then (items) =>
    $scope.all_categories = _.indexBy(items, 'id')
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  # wait for items and all_categories before for we begin initialisation
  $scope.$watch 'items', (newval, oldval) ->
    if newval and angular.isArray(newval) and $scope.all_categories and !$scope.initialised 
      initialise()
  $scope.$watch 'all_categories', (newval, oldval) ->
    if newval and angular.isArray(newval) and $scope.items and !$scope.initialised 
      initialise()


  initialise = () ->

    $scope.initialised = true

    collectCategories()

    # if the basket already has some items, set the stacked items
    if $scope.bb.basket && $scope.bb.basket.items.length > 0 && $scope.bb.basket.items[0].service
      if !$scope.bb.stacked_items || $scope.bb.stacked_items.length == 0
        $scope.bb.setStackedItems($scope.bb.basket.items)

    # if there's already some stacked items (i.e. we've come back to this page,
    # make sure they're selected)
    if $scope.bb.stacked_items && $scope.bb.stacked_items.length > 0
      for item in $scope.items
        for stacked_item in $scope.bb.stacked_items
          item.selected = item.self == stacked_item.service.self
          break if item.selected

      if $scope.bb.moving_booking
        # if we're moving the booking just move to the next step
        $scope.nextStep()

    $scope.setLoaded $scope


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

      $scope.categories.push({
        name           : category_details.name 
        description    : category_details.description 
        sub_categories : sub_categories
      })


  $scope.changeCategory = (category_name, services) ->

    if category_name and services
      $scope.selected_category = {
        name: category_name
        sub_categories: services
      }
      $rootScope.$emit "multi_service_select:category_changed"


  $scope.addItem = (item) ->
    if $scope.bb.stacked_items.length < $scope.options.max_services
      item.selected = true
      iitem = new BBModel.BasketItem(null, $scope.bb)
      iitem.setDefaults($scope.bb.item_defaults)
      iitem.setService(item)
      iitem.setGroup(item.group)
      $scope.bb.stackItem(iitem)
      $rootScope.$emit "multi_service_select:item_added"
    else
      for i in $scope.items
        i.popover = "Sorry, you can only book a maximum of three treatments"
        i.popoverText = i.popover


  $scope.removeItem = (item) ->
    $scope.bb.deleteStackedItemByService(item)
    # loop around the services to set the selected flag, we can't assign 'selected' directly, as the
    # passed in item might be a item from the service list controller or a stacked item
    for i in $scope.items
      i.selected = false if i.self == item.self 


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
    $rootScope.$emit "multi_service_select:add_item"
