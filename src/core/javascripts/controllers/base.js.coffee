'use strict';


angular.module('BB.Directives').directive 'bbWidget', (PathSvc, $http,
    $templateCache, $compile, $q, AppConfig, $timeout, $bbug) ->

  getTemplate = () ->
    src = PathSvc.directivePartial('main').$$unwrapTrustedValue()
    $http.get(src, {cache: $templateCache}).then (response) ->
      response.data
    , (err) ->
      console.log 'err ', err

  updatePartials = (scope, element, prms) ->
    $bbug(i).remove() for i in element.children() when $bbug(i).hasClass('custom_partial')
    appendCustomPartials(scope, element, prms).then () ->
      scope.$broadcast('refreshPage')

  setupPusher = (scope, element, prms) ->
    $timeout () ->
      scope.pusher = new Pusher('c8d8cea659cc46060608')
      scope.pusher_channel = scope.pusher.subscribe("widget_#{prms.design_id}")
      scope.pusher_channel.bind 'update', (data) ->
        updatePartials(scope, element, prms)

  appendCustomPartials = (scope, element, prms) ->
    defer = $q.defer()
    $http.get(prms.custom_partial_url).then (custom_templates) ->
      $compile(custom_templates.data) scope, (custom, scope) ->
        custom.addClass('custom_partial')
        style = (tag for tag in custom when tag.tagName == "STYLE")
        non_style = (tag for tag in custom when tag.tagName != "STYLE")
        $bbug("#widget_#{prms.design_id}").html(non_style)
        element.append(style)
        scope.bb.path_setup = true
        defer.resolve(style)
    defer.promise

  renderTemplate = (scope, element, design_mode) ->
    $q.when(getTemplate()).then (template) ->
      element.html(template)
      element.append('<style widget_css scoped></style>') if design_mode
      $compile(element.contents())(scope)

  restrict: 'A'
  scope:
    client: '=?'
    apiUrl: '@?'
  controller: 'BBCtrl'
  link: (scope, element, attrs) ->
    scope.initWidget(scope.$eval( attrs.bbWidget ))
    prms = scope.bb
    if prms.custom_partial_url
      prms.design_id = prms.custom_partial_url.match(/^.*\/(.*?)$/)[1]
      $bbug("[ng-app='BB']").append("<div id='widget_#{prms.design_id}'></div>")
    if scope.bb.partial_url
      console.log 'partial url ', scope.bb.partial_url
      AppConfig['partial_url'] = scope.bb.partial_url
    unless scope.has_content
      if prms.custom_partial_url
        appendCustomPartials(scope, element, prms).then (style) ->
          $q.when(getTemplate()).then (template) ->
            element.html(template).show()
            $compile(element.contents())(scope)
            element.append(style)
            setupPusher(scope, element, prms) if prms.update_design
      else
        renderTemplate(scope, element, prms.design_mode)
      scope.$on 'refreshPage', () ->
        renderTemplate(scope, element, prms.design_mode)
    else if prms.custom_partial_url
      appendCustomPartials(scope, element, prms)
      setupPusher(scope, element, prms) if prms.update_design
      scope.$on 'refreshPage', () ->
        scope.showPage scope.bb.current_page


# a controller used for the main page contents - just in case we need one here
angular.module('BB.Controllers').controller 'bbContentController', ($scope) ->
  $scope.controller = "public.controllers.bbContentController"
  $scope.initPage = () =>
    $scope.setPageLoaded()
    $scope.setLoadingPage(false)



angular.module('BB.Controllers').controller 'BBCtrl', ($scope, $location,
    $rootScope, halClient, $window, $http, $localCache, $q, $timeout, BasketService,
    LoginService, AlertService, $sce, $element, $compile, $sniffer, $modal,
    BBModel, BBWidget, SSOService, ErrorService, AppConfig, QueryStringService,
    QuestionService, LocaleService, PurchaseService, $bbug) ->
  # dont change the cid as we use it in the app to identify this as the widget
  # root scope
  $scope.cid = "BBCtrl"
  $scope.controller = "public.controllers.BBCtrl"
  $scope.bb = new BBWidget()
  AppConfig.uid = $scope.bb.uid
  $scope.qs =  QueryStringService

  $scope.has_content = $element[0].children.length != 0
  if $scope.apiUrl
    $rootScope.bb ||= {}
    $rootScope.bb.api_url = $scope.apiUrl
  if $rootScope.bb && $rootScope.bb.api_url
    $scope.bb.api_url = $rootScope.bb.api_url
    unless $rootScope.bb.partial_url
      # $scope.bb.partial_url = "#{$scope.bb.api_url}/angular/"
      $scope.bb.partial_url = ""
    else
      $scope.bb.partial_url = $rootScope.bb.partial_url
  # if a custom port was used add that to the url
  if $location.port() isnt 80 and $location.port() isnt 443
    $scope.bb.api_url ||= $location.protocol() + "://" + $location.host() + ":" + $location.port()
    # $scope.bb.partial_url ||= $location.protocol() + "://" + $location.host() + ":" + $location.port() + '/angular/'
  else
    $scope.bb.api_url ||= $location.protocol() + "://" + $location.host()
    # $scope.bb.partial_url ||= $location.protocol() + "://" + $location.host() + '/angular/'


  $scope.bb.stacked_items = []
  # $scope.hide_page = false
  first_call = true
  con_started = $q.defer()
  $rootScope.connection_started = con_started.promise
  widget_started = $q.defer()
  $rootScope.widget_started = widget_started.promise
  moment.locale([LocaleService, "en"])

  $rootScope.Route =
    Company: 0
    Category: 1
    Service: 2
    Person: 3
    Resource: 4
    Duration: 5
    Date: 6
    Time: 7
    Client: 8
    Summary: 9
    Basket: 10
    Checkout: 11


  $compile("<span bb-display-mode></span>") $scope, (cloned, scope) =>
    $bbug($element).append(cloned)

  # legacy (already!) delete by Feb 2014 ;-)
  $scope.set_company = (prms) =>
    $scope.initWidget(prms)

  $scope.initWidget = (prms = {}) =>

    @$init_prms = prms
    # remark the connection as starting again
    con_started = $q.defer()
    $rootScope.connection_started = con_started.promise

    if (!$sniffer.msie || $sniffer.msie > 9) || !first_call
      $scope.initWidget2()
      return
    else

      # ie 8 hacks
      setTimeout $scope.initWidget2, 2000
      if prms.api_url
        url = document.createElement('a');
        url.href = prms.api_url;
        if url.protocol[url.protocol.length - 1] == ':'
          src = "#{url.protocol}//#{url.host}/ClientProxy.html"
        else
          src = "#{url.protocol}://#{url.host}/ClientProxy.html"
        $compile("<iframe id='ieapiframefix' name='" + url.hostname + "' src='#{src}' style='visibility:false;display:none;'></iframe>") $scope, (cloned, scope) =>
          $bbug($element).append(cloned)
      if prms.partial_url && prms.partial_url.indexOf("http") >= 0
        url = document.createElement('a');
        url.href = prms.partial_url or prms.bb.partial_url
        if url.protocol[url.protocol.length - 1] == ':'
          src = "#{url.protocol}//#{url.host}/ClientProxy.html"
        else
          src = "#{url.protocol}://#{url.host}/ClientProxy.html"
        $compile("<iframe id='iepartialframefix' name='" + url.hostname + "' src='#{src}' style='visibility:false;display:none;'></iframe>") $scope, (cloned, scope) =>
          $bbug($element).append(cloned)
      return



  $scope.initWidget2 = () =>

    # Initialize the scope from params
    prms = @$init_prms

    if prms.custom_partial_url
      $scope.bb.custom_partial_url = prms.custom_partial_url
      $scope.bb.partial_id = prms.custom_partial_url.substring(prms.custom_partial_url.lastIndexOf("/")+1)
      $scope.bb.update_design = prms.update_design if prms.update_design
    else if prms.design_mode
      $scope.bb.design_mode = prms.design_mode

    company_id = $scope.bb.company_id
    if prms.company_id
      company_id = prms.company_id
    if prms.affiliate_id
      $scope.bb.affiliate_id = prms.affiliate_id

    if (prms.api_url)
      $scope.bb.api_url = prms.api_url
    if (prms.partial_url)
      $scope.bb.partial_url = prms.partial_url
    if (prms.page_suffix)
      $scope.bb.page_suffix = prms.page_suffix
    else
      $scope.bb.page_suffix = '.html'
    if (prms.admin)
      $scope.bb.isAdmin = prms.admin
    $scope.bb.app_id = 1
    $scope.bb.app_key = 1
    $scope.bb.clear_basket = true
    if prms.basket
      $scope.bb.clear_basket = false
    if prms.clear_basket == false
      $scope.bb.clear_basket = false
    if prms.clear_member
      $scope.bb.clear_member = prms.clear_member
      sessionStorage.removeItem("login")

    if prms.app_id
      $scope.bb.app_id = prms.app_id
    if prms.app_key
      $scope.bb.app_key = prms.app_key
    if prms.affiliate_id
      $rootScope.affiliate_id =  prms.affiliate_id

    if prms.item_defaults
      $scope.bb.item_defaults = prms.item_defaults
    if prms.route_format
      $scope.bb.setRouteFormat(route_format)  

    if prms.locale
      moment.lang(prms.locale)

    if prms.hide == true
      $scope.hide_page = true
    else
      $scope.hide_page = false

    # say we've setup the path - so other partials that are relying on it at can trigger
    if !prms.custom_partial_url
      $scope.bb.path_setup = true

    if prms.reserve_without_questions
      $scope.bb.reserve_without_questions = prms.reserve_without_questions

    @waiting_for_conn_started_def = $q.defer()
    $scope.waiting_for_conn_started = @waiting_for_conn_started_def.promise

    if company_id || $scope.bb.affiliate_id
      $scope.waiting_for_conn_started = $rootScope.connection_started
    else
      @waiting_for_conn_started_def.resolve()

    widget_started.resolve()

  #  halClient.setCache($localCache)

    #########################################################
    # we're going to load a bunch of default stuff which we will vary by the widget
    # there can be two promise stages - a first pass - then a second set or promises which might be created as a results of the first lot being laoded
    # i.e. the active of reolving one promise, may need a second to be reoslved before the widget is created

    setup_promises2 = []
    setup_promises= []

    if $scope.bb.affiliate_id
      aff_promise = halClient.$get($scope.bb.api_url + '/api/v1/affiliates/' + $scope.affiliate_id)
      setup_promises.push(aff_promise)
      aff_promise.then (affiliate) =>
        if $scope.bb.$wait_for_routing
          setup_promises2.push($scope.bb.$wait_for_routing.promise)
        $scope.setAffiliate(new BBModel.Company(affiliate))
        $scope.bb.item_defaults.affiliate = $scope.affiliate

    # load the company
    if company_id
      embed_params = prms.embed if prms.embed
      comp_promise = halClient.$get(new UriTemplate.parse($scope.bb.api_url + '/api/v1/company/{company_id}{?embed}').expand({company_id: company_id, embed: embed_params}))
      setup_promises.push(comp_promise)
      comp_promise.then (company) =>
        if $scope.bb.$wait_for_routing
          setup_promises2.push($scope.bb.$wait_for_routing.promise)
        setup_promises2.push($scope.setCompany(new BBModel.Company(company), prms.keep_basket))

    # an array of promises we want resolves before we'll show a widget - there could be a number of set up calls
    # setup_promises = [comp_promise]

    if first_call
      $scope.bb.default_setup_promises = []
      if $scope.bb.item_defaults.resource
        resource = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/resources/' + $scope.bb.item_defaults.resource )
        setup_promises.push(resource)
        $scope.bb.default_setup_promises.push(resource)
        resource.then (res) =>
          $scope.bb.item_defaults.resource = new BBModel.Resource(res)

      if $scope.bb.item_defaults.person
        person = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/people/' + $scope.bb.item_defaults.person )
        setup_promises.push(person)
        $scope.bb.default_setup_promises.push(person)
        person.then (res) =>
          $scope.bb.item_defaults.person = new BBModel.Person(res)

      if $scope.bb.item_defaults.service
        service = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/services/' + $scope.bb.item_defaults.service )
        setup_promises.push(service)
        $scope.bb.default_setup_promises.push(service)
        service.then (res) =>
          $scope.bb.item_defaults.service = new BBModel.Service(res)

      if $scope.bb.item_defaults.service_ref
        service = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/services?api_ref=' + $scope.bb.item_defaults.service_ref )
        setup_promises.push(service)
        $scope.bb.default_setup_promises.push(service)
        service.then (res) =>
          $scope.bb.item_defaults.service = new BBModel.Service(res)

      if $scope.bb.item_defaults.event_group
        event_group = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/event_groups/' + $scope.bb.item_defaults.event_group )
        setup_promises.push(event_group)
        $scope.bb.default_setup_promises.push(event_group)
        event_group.then (res) =>
          $scope.bb.item_defaults.event_group = new BBModel.EventGroup(res)

      if $scope.bb.item_defaults.event
        event = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/events/' + $scope.bb.item_defaults.event )
        setup_promises.push(event)
        $scope.bb.default_setup_promises.push(event)
        event.then (res) =>
          $scope.bb.item_defaults.event = new BBModel.Event(res)


      if $scope.bb.item_defaults.category
        category = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/categories/' + $scope.bb.item_defaults.category )
        setup_promises.push(category)
        $scope.bb.default_setup_promises.push(category)
        category.then (res) =>
          $scope.bb.item_defaults.category = new BBModel.Category(res)

      if prms.member_sso
        params =
          company_id: company_id
          root: $scope.bb.api_url
          member_sso: prms.member_sso
        sso_member_login = SSOService.memberLogin(params).then (client) ->
            $scope.setClient(client)
        setup_promises.push sso_member_login

      total_id = QueryStringService('total_id')
      if total_id
        params =
          purchase_id: total_id
          url_root: $scope.bb.api_url
        get_total = PurchaseService.query(params).then (total) ->
          $scope.bb.total = total
          if total.paid > 0
            $scope.bb.payment_status = 'complete'
        setup_promises.push get_total

    $scope.isLoaded = false

    $q.all(setup_promises).then () ->
      $q.all(setup_promises2).then () ->
        if !$scope.bb.basket
          $scope.bb.basket ||= new BBModel.Basket(null, $scope.bb)
        if !$scope.client
          $scope.client ||= new BBModel.Client()

        # set up other stuff!
        def_clear = $q.defer()
        clear_prom = def_clear.promise
        if !$scope.bb.current_item
          clear_prom = $scope.clearBasketItem()
        else
          def_clear.resolve()

        clear_prom.then () ->
          if !$scope.client_details
            $scope.client_details = new BBModel.ClientDetails()
          if !$scope.bb.stacked_items
            $scope.bb.stacked_items = []
          if $scope.bb.company || $scope.bb.affiliate
            # onyl start if the company is valid
            con_started.resolve()
            if !prms.no_route
              page = null
              # does the routing have a first step ? use this as long as we've not set explicit 'when' routes
              page = $scope.bb.firstStep if first_call && jQuery.isEmptyObject($scope.bb.routeSteps)
              page = prms.first_page if prms.first_page

              first_call = false
              $scope.decideNextPage(page)
      , (err) ->
        con_started.reject("Failed to start widget")
        $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')
    , (err) ->
      con_started.reject("Failed to start widget")
      $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  ######################
  # set if a page is loaded yet or now helps prevent double loading
  $scope.setLoadingPage = (val) =>
    $scope.loading_page = val

  $scope.isLoadingPage = () =>
    $scope.loading_page


  $scope.showPage = (route, dont_record_page) =>

    $scope.bb.updateRoute(route)
    $scope.jumped = false


    # don't load a new page if we'still loading an old one - helps prevent double clicks
    # TODO: fixme
    # return if $scope.isLoadingPage()

    if $window._gaq
      $window._gaq.push(['_trackPageview', route])
    $scope.setLoadingPage(true)
    if $scope.bb.current_page == route
      $scope.bb_main = ""
      setTimeout () ->
        $scope.bb_main = $sce.trustAsResourceUrl($scope.bb.pageURL(route))
        $scope.$apply()
      , 0
    else
      AlertService.clear() # clear any alerts as part of loading a new page
      $scope.bb.current_page = route
      $scope.bb.recordCurrentPage() if !dont_record_page
      $scope.notLoaded $scope
      $scope.bb_main = $sce.trustAsResourceUrl($scope.bb.pageURL(route))

    $rootScope.$emit "page:loaded"

  $scope.jumpToPage = (route) =>
    $scope.current_page = route
    $scope.jumped = true
    $scope.bb_main = $sce.trustAsResourceUrl($scope.partial_url  + route + $scope.page_suffix)


  $scope.clearPage = () ->
    $scope.bb_main = ""

  $scope.getPartial = (file) ->
    $scope.bb.pageURL(file)

  $scope.setPageLoaded = () ->
    $scope.setLoaded $scope


  $scope.setPageRoute = (route) =>
    $scope.bb.current_page_route = route
    if $scope.bb.routeSteps && $scope.bb.routeSteps[route]
      $scope.showPage($scope.bb.routeSteps[route])
      return true
    return false


  $scope.decideNextPage = (route) ->

    if route
      if route == 'none'
        return
      else
        if $scope.bb.total && $scope.bb.payment_status == 'complete'
          $scope.showPage('payment_complete')
        else
          return $scope.showPage(route)

    # do we have a pre-set route...
    if $scope.bb.nextSteps && $scope.bb.current_page && $scope.bb.nextSteps[$scope.bb.current_page]
      # if  $scope.bb.current_page == "client_admin"
      #   asfasfsf
      return $scope.showPage($scope.bb.nextSteps[$scope.bb.current_page])

    if !$scope.client.valid() && LoginService.isLoggedIn()
      # make sure we set the client to the currently logged in member
      # we should also jsut check the logged in member is  a member of the company they are currently booking with
      $scope.client = new BBModel.Client(LoginService.member()._data)
    if ($scope.bb.company && $scope.bb.company.companies) || (!$scope.bb.company && $scope.affiliate)
      return if $scope.setPageRoute($rootScope.Route.Company)
      return $scope.showPage('company_list')
    else if $scope.bb.total && $scope.bb.payment_status == "complete"
      return $scope.showPage('payment_complete')
    else if ($scope.bb.company.$has('event_groups') && !$scope.bb.current_item.event_group && !$scope.bb.current_item.service && !$scope.bb.current_item.product)
      return $scope.showPage('event_group_list')
    else if ($scope.bb.company.$has('events') && $scope.bb.current_item.event_group && !$scope.bb.current_item.event? && !$scope.bb.current_item.product)
      return $scope.showPage('event_list')
    else if ($scope.bb.company.$has('events') && $scope.bb.current_item.event && !$scope.bb.current_item.num_book && !$scope.bb.current_item.tickets && !$scope.bb.current_item.product)
      return $scope.showPage('event')
    else if ($scope.bb.company.$has('services') && !$scope.bb.current_item.service && !$scope.bb.current_item.event? && !$scope.bb.current_item.product)
      return if $scope.setPageRoute($rootScope.Route.Service)
      return $scope.showPage('service_list')
    else if ($scope.bb.company.$has('resources') && !$scope.bb.current_item.resource && !$scope.bb.current_item.event? && !$scope.bb.current_item.product)
      return if $scope.setPageRoute($rootScope.Route.Resource)
      return $scope.showPage('resource_list')
    else if ($scope.bb.company.$has('people') && !$scope.bb.current_item.person && !$scope.bb.current_item.event? && !$scope.bb.current_item.product)
      return if $scope.setPageRoute($rootScope.Route.Person)
      return $scope.showPage('person_list')
    else if (!$scope.bb.current_item.duration && !$scope.bb.current_item.event? && !$scope.bb.current_item.product)
      return if $scope.setPageRoute($rootScope.Route.Duration)
      return $scope.showPage('duration_list')
    else if ($scope.bb.current_item.days_link && !$scope.bb.current_item.date && !$scope.bb.current_item.event?)
      return if $scope.setPageRoute($rootScope.Route.Date)
      return $scope.showPage('day')
    else if ($scope.bb.current_item.days_link && !$scope.bb.current_item.time && !$scope.bb.current_item.event? && (!$scope.bb.current_item.service || $scope.bb.current_item.service.duration_unit != 'day'))
      return if $scope.setPageRoute($rootScope.Route.Time)
      return $scope.showPage('time')
    else if ($scope.bb.moving_booking && (!$scope.bb.current_item.ready || !$scope.bb.current_item.move_done))
      return $scope.showPage('check_move')
    else if (!$scope.client.valid())
      return if $scope.setPageRoute($rootScope.Route.Client)
      if $scope.bb.isAdmin
        return $scope.showPage('client_admin')
      else
        return $scope.showPage('client')
    else if (!$scope.bb.basket.readyToCheckout() || !$scope.bb.current_item.ready )
      return if $scope.setPageRoute($rootScope.Route.Summary)
      if $scope.bb.isAdmin
        return $scope.showPage('check_items_admin')
      else
        return $scope.showPage('check_items')
    else if ($scope.bb.usingBasket && !$scope.bb.confirmCheckout)
      return if $scope.setPageRoute($rootScope.Route.Basket)
      return $scope.showPage('basket')
    else if $scope.bb.moving_booking && $scope.bb.basket.readyToCheckout()
      return $scope.showPage('move_done')
    else if ($scope.bb.basket.readyToCheckout() && $scope.bb.payment_status == null)
      return if $scope.setPageRoute($rootScope.Route.Checkout)
      return $scope.showPage('checkout')
    else if ($scope.bb.total && $scope.bb.payment_status == "pending")
      return $scope.showPage('payment')
    else if $scope.bb.payment_status == "complete"
      return $scope.showPage('payment_complete')


  $scope.showCheckout = ->
    $scope.bb.current_item.ready

  # add the current item to the basket service
  $scope.addItemToBasket = ->
    add_defer = $q.defer()

    if !$scope.bb.current_item.submitted && !$scope.bb.moving_booking
      $scope.bb.current_item.submitted = true
      params = {member_id: $scope.client.id, member: $scope.client, item: $scope.bb.current_item, bb: $scope.bb }
      BasketService.addItem($scope.bb.company, params).then (basket) ->
        for item in basket.items
          item.reserve_without_questions = $scope.bb.reserve_without_questions
        $scope.setBasket(basket)
        $scope.setBasketItem(basket.items[0])
        # check if item has been added to the basket
        if !$scope.bb.current_item
          # not added to basket, clear the item
          $scope.clearBasketItem().then () ->
            add_defer.resolve(basket)
        else
          add_defer.resolve(basket)
      , (err) ->
        $scope.bb.current_item.submitted = false
        add_defer.reject(err)
        if err.status == 409
          # clear the currently cached time date
          halClient.clearCache("time_day")
          error_modal = $modal.open
            templateUrl: $scope.getPartial('error_modal')
            controller: ($scope, $modalInstance) ->
              $scope.message = "Sorry. The item you were trying to book " +
                "is no longer available. Please try again."
              $scope.ok = () ->
                $modalInstance.close()
          error_modal.result.then () ->
            if $scope.bb.nextSteps
              $scope.loadPreviousStep()
            else
              $scope.decideNextPage()
    else
      add_defer.resolve()
    add_defer.promise


  # add several items at once
  $scope.updateBasket = () ->
    add_defer = $q.defer()
    params = {member_id: $scope.client.id, member: $scope.client, items: $scope.bb.basket.items, bb: $scope.bb }
    BasketService.updateBasket($scope.bb.company, params).then (basket) ->
      for item in basket.items
        item.reserve_without_questions = $scope.bb.reserve_without_questions
      $scope.setBasket(basket)
      $scope.setBasketItem(basket.items[0])
      # check if item has been added to the basket
      if !$scope.bb.current_item
        # not added to basket, clear the item
        $scope.clearBasketItem().then () ->
          add_defer.resolve(basket)
      else    
        add_defer.resolve(basket)
    , (err) ->
      add_defer.reject(err)
    add_defer.promise

  $scope.emptyBasket = ->
    BasketService.empty($scope.bb).then (basket) ->
      $scope.setBasket(basket)

  $scope.deleteBasketItem = (item) ->
    BasketService.deleteItem(item, $scope.bb.company, {bb: $scope.bb}).then (basket) ->
      $scope.setBasket(basket)

  $scope.clearBasketItem = ->
    def = $q.defer()
    $scope.setBasketItem(new BBModel.BasketItem(null, $scope.bb))
    $scope.bb.current_item.reserve_without_questions = $scope.bb.reserve_without_questions
    $q.all($scope.bb.default_setup_promises)['finally'] () ->
      $scope.bb.current_item.setDefaults($scope.bb.item_defaults)
      $q.all($scope.bb.current_item.promises)['finally'] () ->
        def.resolve()
    return def.promise


  $scope.setBasketItem = (item) ->
    $scope.bb.current_item = item
    # for now also set a variable in the scope - for old views that we've not tidied up yet
    $scope.current_item = $scope.bb.current_item

  # say that the basket is ready to checkout
  $scope.setReadyToCheckout = (ready) ->
    $scope.bb.confirmCheckout = ready

  $scope.moveToBasket = ->
    $scope.bb.basket.addItem($scope.bb.current_item)

  $scope.quickEmptybasket = ->
    $scope.bb.stacked_items = []
    $scope.setBasket(new BBModel.Basket(null, $scope.bb))
    $scope.clearBasketItem()

  $scope.setBasket = (basket) ->
    $scope.bb.basket = basket
    $scope.basket = basket
    $scope.bb.basket.company_id = $scope.bb.company_id
    # were there stacked items - if so reset the stack items to the basket contents
    if $scope.bb.stacked_items
      $scope.bb.setStackedItems(basket.items)


  # clear the user and logout
  $scope.logout = (route) ->
    if $scope.client && $scope.client.valid()
      LoginService.logout({root: $scope.bb.api_url}).then ->
        $scope.client =  new BBModel.Client()
        $scope.decideNextPage(route)
    else if $scope.member
      LoginService.logout({root: $scope.bb.api_url}).then ->
        $scope.member =  new BBModel.Member.Member()
        $scope.decideNextPage(route)


  $scope.setAffiliate = (affiliate) ->
    $scope.bb.affiliate_id = affiliate.id
    $scope.bb.affiliate = affiliate
    # for now also set a scope varaible for company - we should remove this as soon as all partials are moved over
    $scope.affiliate = affiliate
    $scope.affiliate_id = affiliate.id


  restoreBasket = () ->
    restore_basket_defer = $q.defer()
    $scope.quickEmptybasket().then () ->
      auth_token = sessionStorage.getItem('auth_token')
      href = $scope.bb.api_url +
        '/api/v1/status{?company_id,affiliate_id,clear_baskets,clear_member}'
      params =
        company_id: $scope.bb.company_id
        affiliate_id: $scope.bb.affiliate_id
        clear_baskets: if $scope.bb.clear_basket then '1' else null
        clear_member: if $scope.bb.clear_member then '1' else null
      uri = new UriTemplate.parse(href).expand(params)
      status = halClient.$get(uri, {"auth_token": auth_token, "no_cache": true})
      status.then (res) =>
        if res.$has('client')
          res.$get('client').then (client) =>
            $scope.client = new BBModel.Client(client)
        if res.$has('member')
          res.$get('member').then (member) =>
            LoginService.setLogin(member)
        if $scope.bb.clear_basket
          restore_basket_defer.resolve()
        else
          if res.$has('baskets')
            res.$get('baskets').then (baskets) =>
              basket = _.find(baskets, (b) ->
                b.company_id == $scope.bb.company_id)
              if basket
                basket = new BBModel.Basket(basket, $scope.bb)
                basket.$get('items').then (items) ->
                  items = (new BBModel.BasketItem(i) for i in items)
                  basket.addItem(i) for i in items
                  $scope.setBasket(basket)
                  promises = [].concat.apply([], (i.promises for i in items))
                  $q.all(promises).then () ->
                    if basket.items.length > 0
                      $scope.setBasketItem(basket.items[0])
                    restore_basket_defer.resolve()
              else
                restore_basket_defer.resolve()
          else
            restore_basket_defer.resolve()
      , (err) ->
        restore_basket_defer.resolve()
    restore_basket_defer.promise

  $scope.setCompany = (company, keep_basket) ->
    defer = $q.defer()
    $scope.bb.company_id = company.id
    $scope.bb.company = company
    # for now also set a scope vbaraible for company - we should remove this as soon as all partials are moved over
    $scope.company = company
    $scope.bb.item_defaults.company = $scope.bb.company

    if company.$has('settings')
      company.getSettings().then (settings) =>
        # setup some useful info
        $scope.bb.company_settings = settings
        $scope.bb.item_defaults.merge_resources = true if $scope.bb.company_settings.merge_resources
        $scope.bb.item_defaults.merge_people = true if $scope.bb.company_settings.merge_people
        $rootScope.bb_currency = $scope.bb.company_settings.currency
        $scope.bb.currency = $scope.bb.company_settings.currency
        $scope.bb.has_prices = $scope.bb.company_settings.has_prices

        if !$scope.bb.basket || ($scope.bb.basket.company_id != $scope.bb.company_id && !keep_basket)
          restoreBasket().then () ->
            defer.resolve()
        else
          defer.resolve()
    else
      if !$scope.bb.basket || ($scope.bb.basket.company_id != $scope.bb.company_id && !keep_basket)
        restoreBasket().then () ->
          defer.resolve()
      else
        defer.resolve()
    defer.promise


  ############################################################################################
  # Breadcrumbs
  ############################################################################################

  # record a steop in the checkout process
  $scope.recordStep = (step, title) ->
    $scope.bb.recordStep(step, title)

  # set the title fo the current step
  $scope.setStepTitle = (title) ->
    $scope.bb.steps[$scope.bb.current_step-1].title = title


  $scope.getCurrentStepTitle = ->
    steps = $scope.bb.steps

    if !_.compact(steps).length
      steps = $scope.bb.allSteps

    if $scope.bb.current_step
        return steps[$scope.bb.current_step-1].title

  # conditionally set the title of the current step - if it doesn't have one
  $scope.checkStepTitle = (title) ->
    if !$scope.bb.steps[$scope.bb.current_step-1].title
      $scope.setStepTitle(title)

  # reload a step
  $scope.loadStep = (step) ->
    return if step == $scope.bb.current_step
    $scope.bb.calculatePercentageComplete(step)
    # so actually use the data from the "next"page if there is one - but show the correct page
    # this means we load the completed data from that page
    # if there isn't a next page - then try the select one
    st = $scope.bb.steps[step]
    prev_step =  $scope.bb.steps[step-1]
    prev_step = st if st && !prev_step
    st = prev_step if !st
    if st && !$scope.bb.last_step_reached
      $scope.bb.stacked_items = [] if !st.stacked_length ||  st.stacked_length == 0
      $scope.bb.current_item.loadStep(st.current_item)
      $scope.bb.steps.splice(step, $scope.bb.steps.length-step)
      $scope.bb.current_step = step
      $scope.showPage(prev_step.page, true)
    if $scope.bb.allSteps
      for step in $scope.bb.allSteps
        step.active = false
        step.passed = step.number < $scope.bb.current_step
      if $scope.bb.allSteps[$scope.bb.current_step-1]
        $scope.bb.allSteps[$scope.bb.current_step-1].active = true


  $scope.loadPreviousStep = () ->
    previousStep = $scope.bb.current_step - 1
    $scope.loadStep(previousStep)

  $scope.loadStepByPageName = (page_name) ->
    for step in $scope.bb.allSteps
      if step.page == page_name
        return $scope.loadStep(step.number)
    return $scope.loadStep(1)

  $scope.restart = () ->
    $scope.bb.last_step_reached = false
    $scope.loadStep(1)

  # setup full route data
  $scope.setRoute = (rdata) ->
    $scope.bb.setRoute(rdata)

  # set basic step path only
  $scope.setBasicRoute = (routes) ->
    $scope.bb.setBasicRoute(routes)


  # record the page right now
  # this look s the a record breadcrumb step path - and also helps keep updated passed and current steps


  $scope.skipThisStep = () ->
    $scope.bb.current_step -= 1


  #############################################################

  $scope.setUsingBasket = (usingBasket) =>
    $scope.bb.usingBasket = usingBasket

  $scope.setClient = (client) =>
    $scope.client = client
    $scope.bb.postcode = client.postcode if client.postcode && !$scope.bb.postcode

  #######################################################
  # date helpers

  $scope.today = moment().toDate()
  $scope.tomorrow = moment().add(1, 'days').toDate()

  $scope.parseDate = (d) =>
    moment(d)

  $scope.getUrlParam = (param) =>
    $window.getURIparam param

  $scope.base64encode = (param) =>
    $window.btoa(param)

  $scope.setLastSelectedDate = (date) =>
    $scope.last_selected_date = date


  # TODO: Get rid of these 'scope loading' methods when they are no longer
  # called from the scopes
  $scope.setLoaded = (cscope) ->
    cscope.$emit 'hide:loader', cscope
    # set the scope loaded to true...
    cscope.isLoaded = true
    # then walk up the scope chain looking for the 'loading' scope...
    loadingFinished = true;

    while cscope
      if cscope.hasOwnProperty('scopeLoaded')
        # then check all the scope objects looking to see if any scopes are
        # still loading
        if $scope.areScopesLoaded(cscope)
          cscope.scopeLoaded = true
        else
          loadingFinished = false
      cscope = cscope.$parent

    if loadingFinished
      $rootScope.$emit 'loading:finished'
    return


  $scope.setLoadedAndShowError = (scope, err, error_string) ->
    $scope.setLoaded(scope)
    AlertService.danger(ErrorService.getError('GENERIC'))


  # go around schild scopes - return false if *any* child scope is marked as
  # isLoaded = false
  $scope.areScopesLoaded = (cscope) ->
    if cscope.hasOwnProperty('isLoaded') && !cscope.isLoaded
      false
    else
      child = cscope.$$childHead
      while (child)
        return false if !$scope.areScopesLoaded(child)
        child = child.$$nextSibling
      true

  #set scope not loaded...
  $scope.notLoaded = (cscope) ->
    $scope.$emit 'show:loader', $scope
    cscope.isLoaded = false
    # then look through all the scopes for the 'loading' scope, which is the
    # scope which has a 'scopeLoaded' property and set it to false, which makes
    # the ladoing gif show;
    while cscope
      if cscope.hasOwnProperty('scopeLoaded')
        cscope.scopeLoaded = false
      cscope = cscope.$parent
    return






  $scope.broadcastItemUpdate = () =>
    $scope.$broadcast("currentItemUpdate", $scope.bb.current_item)

  # do you show the page.
  $scope.hidePage = () ->
    $scope.hide_page = true

  $scope.bb.company_set =() ->
    $scope.bb.company_id?

  $scope.isAdmin = () ->
    $scope.bb.isAdmin

  $scope.isAdminIFrame = () ->
    if !$scope.bb.isAdmin
      return false

    try
      location = $window.parent.location.href
      if location && $window.parent.reload_dashboard
        return true
      else
        return false
    catch err
      return false

  $scope.reloadDashboard = ->
    $window.parent.reload_dashboard()

  $scope.$debounce = ->
    return false if $scope._debouncing
    $scope._debouncing = true
    $timeout ->
      $scope._debouncing = false
    , 100

  $scope.supportsTouch = () ->
    Modernizr.touch

  $rootScope.$on 'show:loader', () ->
    $scope.loading = true
  $rootScope.$on 'hide:loader', () ->
    $scope.loading = false
