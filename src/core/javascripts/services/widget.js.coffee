'use strict';


# This class contrains handy functions and variables used in building and displaying a booking widget

angular.module('BB.Models').factory "BBWidget", ($q, BBModel, BasketService, $urlMatcherFactory, $location, BreadcrumbService, $window, $rootScope) ->


  class Widget


    constructor: () ->
      # uid used to store form data for user journeys
      @uid = _.uniqueId 'bbwidget_'
      @page_suffix = ""
      @steps = []
      @allSteps = []
      @item_defaults = {}
      @usingBasket = false  # bu defalt we're not going to use a basket
      @confirmCheckout = false
      @isAdmin = false
      @payment_status = null


    pageURL: (route) ->
      route + '.html'



    updateRoute: (page) ->
      return if !@routeFormat

      page ||= @current_page
      pattern = $urlMatcherFactory.compile(@routeFormat)
      service_name = "-"
      event_group = "-"
      if @current_item
        service_name = @convertToDashSnakeCase(@current_item.service.name) if @current_item.service
        event_group = @convertToDashSnakeCase(@current_item.event_group.name) if @current_item.event_group
        date = @current_item.date.date.toISODate() if @current_item.date
        time = @current_item.time.time if @current_item.time
        company = @convertToDashSnakeCase(@current_item.company.name) if @current_item.company

      prms = angular.copy(@route_values) if @route_values
      prms ||= {}
      angular.extend(prms,{page: page, company: company, service: service_name, event_group: event_group, date: date, time: time})

      url = pattern.format(prms)
      url = url.replace(/\/+$/, "")
      $location.path(url)
      @routing = true
      return url


    setRouteFormat: (route) ->
      @routeFormat = route
      return if !@routeFormat

      @routing = true

      path = $location.path()

      if path
        parts = @routeFormat.split("/")
        while parts.length > 0 && !match
          match_test = parts.join("/")
          pattern = $urlMatcherFactory.compile(match_test)
          match = pattern.exec(path)
          parts.pop()

        if match
          @item_defaults.company = decodeURIComponent(match.company) if match.company
          @item_defaults.service = decodeURIComponent(match.service) if match.service && match.service != "-"
          @item_defaults.event_group = match.event_group if match.event_group && match.event_group != "-"
          @item_defaults.person = decodeURIComponent(match.person) if match.person
          @item_defaults.resource = decodeURIComponent(match.resource) if match.resource
          @item_defaults.date = match.date if match.date
          @item_defaults.time = match.time if match.time
          @route_matches = match


    matchURLToStep: () ->
      return null if !@routeFormat
      path = $location.path()

      for step,_i in @steps
        return step.number if step.url && step.url == path

      return null

    convertToDashSnakeCase: (str) ->
        str = str.toLowerCase();
        str = $.trim(str)
        # replace all punctuation and special chars
        str = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '')
        # replace any double or more spaces
        str = str.replace(/\s{2,}/g, ' ')
        # convert to sanke case
        str = str.replace(/\s/g, '-')
        return str

    recordCurrentPage: () =>
      if !@current_step
        @current_step = 0
      match = false
      # can we find a match for this step against either previous or existing steps ?
      # first check the pre-defined steps
      if @allSteps
        for step in @allSteps
          if step.page == @current_page
            @current_step = step.number
            match = true
      # now check the previously visited steps
      if !match
        for step in @steps
          if step && step.page == @current_page
            @current_step = step.number
            match = true
      # if still not found - assume it's a new 'next' page and add 1 to the step count
      if !match
        @current_step += 1

      title = ""
      if @allSteps
        for step in @allSteps
          step.active = false
          step.passed = step.number < @current_step
        if @allSteps[@current_step-1]
          @allSteps[@current_step-1].active = true
          title = @allSteps[@current_step-1].title
      @recordStep(@current_step, title)


    recordStep: (step, title) =>
      @steps[step-1] = {
        url: @updateRoute(@current_page),
        current_item: @current_item.getStep(), 
        page: @current_page, 
        number: step, 
        title: title,
        stacked_length: @stacked_items.length
        }

      BreadcrumbService.setCurrentStep(step)

      for step in @steps
        if step
          step.passed = step.number < @current_step
          step.active = step.number == @current_step

      # calc percentile complete
      @calculatePercentageComplete(step.number)

      # check if we're at the last step
      if (@allSteps && @allSteps.length == step ) || @current_page == 'checkout'
        @last_step_reached = true
      else
        @last_step_reached = false


    calculatePercentageComplete: (step_number) =>
      @percentage_complete = if step_number && @allSteps then step_number / @allSteps.length * 100 else 0


    # setup full route data
    setRoute: (rdata) =>
      @allSteps.length = 0
      @nextSteps = {}
      @routeSteps = {}
      @firstStep = rdata[0].page unless rdata is undefined || rdata is null || rdata[0] is undefined
      for step, i in rdata
        @disableGoingBackAtStep = i+1 if step.disable_breadcrumbs
        if rdata[i+1]
          @nextSteps[step.page] = rdata[i+1].page
        @allSteps.push({number: i+1, title: step.title, page: step.page})
        if step.when
          for route in step.when
            @routeSteps[route] = step.page
      if @$wait_for_routing
        @$wait_for_routing.resolve()

    setBasicRoute: (routes) =>
      @nextSteps = {}
      @firstStep = routes[0]
      for step, i in routes
        @nextSteps[step] = routes[i+1]
      if @$wait_for_routing
        @$wait_for_routing.resolve()


    waitForRoutes: () =>
      if !@$wait_for_routing
        @$wait_for_routing = $q.defer()


    ###############################################################
    # stacking items

    stackItem: (item) =>
      @stacked_items.push(item)
      @sortStackedItems()

    setStackedItems: (items) =>
      @stacked_items = items
      @sortStackedItems()

    sortStackedItems: =>
      # make sure all of the cats resolved
      arr = []
      for item in @stacked_items
        arr = arr.concat(item.promises)

      $q.all(arr)['finally'] () =>
        @stacked_items = @stacked_items.sort (a, b) =>
          if a.time && b.time
            a.time.time > b.time.time ? 1 : -1
          else if a.service.category && !b.service.category
            1
          else if b.service.category && !a.service.category
            -1
          else if !b.service.category && !a.service.category
            1
          else
            a.service.category.order > b.service.category.order ? 1 : -1


    deleteStackedItem: (item) =>
      if item && item.id
        BasketService.deleteItem(item, @company, {bb: @})

      @stacked_items = @stacked_items.filter (i) -> i isnt item

    deleteStackedItemByService: (item) =>
      for i in @stacked_items
        if i && i.service && i.service.self == item.self && i.id
          BasketService.deleteItem(i, @company, {bb: @})
      @stacked_items = @stacked_items.filter (i) -> (i && i.service && i.service.self isnt item.self)

    emptyStackedItems: () =>
      @stacked_items = []

    pushStackToBasket: () ->
      @basket ||= new new BBModel.Basket(null, @)
      for i in @stacked_items
        @basket.addItem(i)
      @emptyStackedItems()

    totalStackedItemsDuration: ->
      duration = 0
      for item in @stacked_items
        duration += item.service.listed_duration if item.service and item.service.duration
      return duration


    # Address methods
    clearAddress: () =>
      delete @address1
      delete @address2
      delete @address3
      delete @address4
      delete @address5
