app = angular.module 'BB.Directives'



app.directive 'ngConfirmClick', () ->
  link: (scope, element, attr) ->
    msg = attr.ngConfirmClick || "Are you sure?";
    clickAction = attr.ngConfirmedClick;
    element.bind 'click', (event) =>
      if window.confirm(msg)
        scope.$eval(clickAction)



app.directive 'ngValidInclude', ($compile) ->
    link: (scope, element, attr) ->
      scope[attr.watchValue].then (logged) =>
        element.attr('ng-include', attr.ngValidInclude)
        element.attr('ng-valid-include',null)
        $compile(element)(scope)



app.directive 'ngDelayed',  ($compile) ->
    link: (scope, element, attr) ->
      scope[attr.ngDelayedWatch].then (logged) =>
        element.attr(attr.ngDelayed, attr.ngDelayedValue)
        element.attr('ng-delayed-value',null)
        element.attr('ng-delayed-watch',null)
        element.attr('ng-delayed',null)
        $compile(element)(scope)
        if attr.ngDelayedReady
          scope[attr.ngDelayedReady].resolve(true)



app.directive 'ngInitial', ->
    restrict: 'A',
    controller: [
      '$scope', '$element', '$attrs', '$parse', ($scope, $element, $attrs, $parse) ->
        val = $attrs.ngInitial || $attrs.value
        getter = $parse($attrs.ngModel)
        setter = getter.assign
        if val == "true"
          val = true
        else if val == "false"
          val = false
        setter($scope, val)
    ]



app.directive 'bbPrintPage', ($window, $timeout) ->
  restrict: 'A',
  link:(scope, element, attr) ->
    if attr.bbPrintPage
      scope.$watch attr.bbPrintPage, (newVal, oldVal) =>
        console.log attr.bbPrintPage
        $timeout(->
          $window.print()
        3000)



app.directive 'bbInclude', ($compile) ->
  link: (scope, element, attr) ->
    scope.$watch 'bb.path_setup', (newval, oldval) =>
      if newval
        console.log 'bb include ', newval
        element.attr('ng-include', "'" + scope.getPartial(attr.bbInclude) + "'")
        element.attr('bb-include',null)
        $compile(element)(scope)



# Form directive to allow users to specify if they want the form to raise alerts when
# there is invalid input.
app.directive 'bbRaiseAlertWhenInvalid', ($compile) ->
  require: '^form'
  link: (scope, element, attr, ctrl) ->
    ctrl.raise_alerts = true

    options = scope.$eval attr.bbRaiseAlertWhenInvalid
    ctrl.alert = options.alert if options and options.alert



app.directive 'bbHeader', ($compile) ->
    link: (scope, element, attr) ->
      scope.bb.waitForRoutes()
      scope.$watch 'bb.path_setup', (newval, oldval) =>
        if newval
          element.attr('ng-include', "'" + scope.getPartial(attr.bbHeader) + "'")
          element.attr('bb-header',null)
          $compile(element)(scope)



app.directive 'bbDate', () ->
  restrict: 'AE'
  scope: true
  link : (scope, element, attrs) ->

    track_service = attrs.bbTrackService?

    # set the date, first test if bbDate has been set, otherwise use the current item's
    # date. If neither are set, set the date as today
    if attrs.bbDate
     date = moment( scope.$eval( attrs.bbDate ) )
    else if scope.bb && scope.bb.current_item && scope.bb.current_item.date
      date = scope.bb.current_item.date.date
    else
      date = moment()

    # if we've been instructed to track the service, set the min/max date
     if track_service && scope.bb.current_item && scope.bb.current_item.service
      scope.min_date = scope.bb.current_item.service.min_advance_datetime
      scope.max_date = scope.bb.current_item.service.max_advance_datetime

    # broadcast a dateChanged event to ensure listeners are updated
    scope.$broadcast('dateChanged', moment(date))

    # bb_date
    scope.bb_date = {

      date: date
      js_date: date.toDate()

      addDays: (type, amount) ->
        @date = moment(@date).add(amount, type)
        @js_date = @date.toDate()
        scope.$broadcast('dateChanged', moment(@date))

      subtractDays: (type, amount) ->
        @addDays(type, -amount)

      setDate: (date) ->
        @date    = date
        @js_date = date.toDate()
        scope.$broadcast('dateChanged', moment(@date))
    }

    # watch the current_item for updates
    scope.$on "currentItemUpdate", (event) ->

      # set the min/max date if a service has been set
      if scope.bb.current_item.service && track_service
        scope.min_date = scope.bb.current_item.service.min_advance_datetime
        scope.max_date = scope.bb.current_item.service.max_advance_datetime

        # if the bb_date is before/after the min/max date, move it to the min/max date
        scope.bb_date.setDate(scope.min_date.clone()) if scope.bb_date.date.isBefore(scope.min_date, 'day') 
        scope.bb_date.setDate(scope.max_date.clone()) if scope.bb_date.date.isAfter(scope.max_date, 'day')

    # if the js_date has changed, update the moment date representation
    # and broadcast an update
    scope.$watch 'bb_date.js_date', (newval, oldval) ->
      ndate = moment(newval)
      if !scope.bb_date.date.isSame(ndate)
        scope.bb_date.date = ndate 
        scope.$broadcast('dateChanged', moment(ndate))



app.directive 'bbDebounce', ($timeout) ->
  restrict: 'A',
  link: (scope, element, attrs) ->
    delay = 400
    delay = attrs.bbDebounce if attrs.bbDebounce 

    element.bind 'click', () =>
      $timeout () =>
        element.attr('disabled', true)
      , 0
      $timeout () =>
        element.attr('disabled', false)
      , delay



# bbLocalNumber
# Adds a formatter that prepends the model value with zero. This is useful for
# nicely formatting numbers where the prefix has been stripped, i.e. '7875123456'
app.directive 'bbLocalNumber', () ->
  restrict: 'A',
  require: 'ngModel',
  link: (scope, element, attrs, ctrl) ->

    prettyifyNumber = (value) ->
      if value and value[0] != "0"
        value = "0" + value
      else
        value
      return value

    ctrl.$formatters.push(prettyifyNumber)



# bbFormResettable
# Adds field clearing behaviour to forms.  
app.directive 'bbFormResettable', ($parse) ->
  restrict: 'A'
  controller: ($scope, $element, $attrs) ->
    $scope.inputs = []

    $scope.resetForm = (options) ->
      $scope[$attrs.name].submitted = false if options and options.clear_submitted
      for input in $scope.inputs
        input.getter.assign($scope, null)
        input.controller.$setPristine()

    registerInput: (input, ctrl) ->
      getter = $parse input
      $scope.inputs.push({getter: getter, controller: ctrl})



# bbResettable
# Registers inputs with the bbFormResettable controller allowing them to be cleared
app.directive 'bbResettable', () ->
  restrict: 'A',
  require: ['ngModel', '^bbFormResettable'],
  link: (scope, element, attrs, ctrls) ->
    ngModelCtrl        = ctrls[0]
    formResettableCtrl = ctrls[1]
    formResettableCtrl.registerInput(attrs.ngModel, ngModelCtrl)



# bbDateSplit
app.directive 'bbDateSplit', ($parse) ->
  restrict: 'A'
  require: ['ngModel']
  link: (scope, element, attrs, ctrls) ->

    ngModel = ctrls[0]

    scope[ngModel.$name + '_date_split'] = {
      day:   null
      month: null
      year:  null
      date:  null

      joinDate: (day, month, year) ->
        if day && month && year
          date_string = day + '/' + month + '/' + year 
          @date = moment(date_string, "DD/MM/YYYY")
          date_string = @date.format('YYYY-MM-DD')

          ngModel.$setViewValue(date_string)
          ngModel.$render()     

      splitDate: (date) ->
        if date && date.isValid()
          @day   = date.date()
          @month = date.month() + 1
          @year  = date.year()
          @date  = date
    }

    split_date = scope[ngModel.$name + '_date_split'] 

    # split the date if it's already set
    split_date.splitDate(moment(ngModel.$viewValue)) if ngModel.$viewValue

    # setup watches for day/month/year inputs
    scope.$watch ngModel.$name + '_date_split.day', (newval, oldval) ->
      if newval != oldval && (!split_date.date || (split_date && split_date.date.date() != newval))
        day   = newval
        month = scope.$eval ngModel.$name + '_date_split.month'
        year  = scope.$eval ngModel.$name + '_date_split.year'
        split_date.joinDate(day, month, year)

    scope.$watch ngModel.$name + '_date_split.month', (newval, oldval) ->
      if newval != oldval && (!split_date.date || (split_date && split_date.date.month() + 1 != newval))
        day   = scope.$eval ngModel.$name + '_date_split.day'
        month = newval
        year  = scope.$eval ngModel.$name + '_date_split.year'
        split_date.joinDate(day, month, year)

    scope.$watch ngModel.$name + '_date_split.year', (newval, oldval) ->
      if newval != oldval && (!split_date.date || (split_date && split_date.date.year() != newval))
        day   = scope.$eval ngModel.$name + '_date_split.day'
        month = scope.$eval ngModel.$name + '_date_split.month'
        year  = newval
        split_date.joinDate(day, month, year)
  
    # watch self to split date when it changes  
    scope.$watch attrs.ngModel, (newval) ->
      if newval
        new_date = moment(newval)
        if !new_date.isSame(split_date.date)
          split_date.splitDate(new_date)


# bbCommPref
app.directive 'bbCommPref', ($parse) ->
  restrict: 'A'
  require: ['ngModel', '^bbItemDetails']
  link: (scope, element, attrs, ctrls) ->

    ngModelCtrl     = ctrls[0]
    itemDetailsCtrl = ctrls[1]

    # get the default communication preference 
    comm_pref_default = scope.$eval attrs.bbCommPref or false

    # and set it
    itemDetailsCtrl.setCommunicationPreferences(comm_pref_default)
    ngModelCtrl.$setViewValue(comm_pref_default)

    # watch for changes
    scope.$watch attrs.ngModel, (newval, oldval) ->
      itemDetailsCtrl.setCommunicationPreferences(newval) if newval != oldval


# bbOwlCarousel
app.directive "bbOwlCarousel", ->
  restrict: "A"
  link: (scope, element, attrs) ->

    # check for presence of owlCarousel
    return if not element.owlCarousel

    options = scope.$eval(attrs.bbOwlCarousel)
    
    scope.initCarousel = ->
      scope.destroyCarousel()
      element.owlCarousel options

      # bind prev/next actions
      # TODO make accessible via ng-click and scope to instantiated carousel to allow multiple per page
      $('.bb-owl-prev').click ->
        element.trigger('owl.prev')
      $('.bb-owl-next').click ->
        element.trigger('owl.next')

    scope.destroyCarousel = ->
      element.data('owlCarousel').destroy() if element.data('owlCarousel')

    scope.$watch options.data, (newval, oldval) ->
      if newval and newval.length > 0
        scope.initCarousel()


# bbCountTicketTypes
app.directive 'bbCountTicketTypes', () ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    items = scope.$eval(attrs.bbCountTicketTypes)
    counts = []
    for item in items
      if item.tickets
        if counts[item.tickets.name] then counts[item.tickets.name] += 1 else counts[item.tickets.name] = 1
        item.number = counts[item.tickets.name]


# bbCapitaliseFirstLetter
app.directive 'bbCapitaliseFirstLetter', () ->
  restrict: 'A'
  require: ['ngModel']
  link: (scope, element, attrs, ctrls) ->
    ngModel = ctrls[0]

    scope.$watch attrs.ngModel, (newval, oldval) ->
      if newval
        string = scope.$eval attrs.ngModel
        string = string.charAt(0).toUpperCase() + string.slice(1)
        ngModel.$setViewValue(string)
        ngModel.$render()
        return