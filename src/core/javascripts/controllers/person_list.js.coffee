'use strict';


angular.module('BB.Directives').directive 'bbPeople', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'PersonList'
  link : (scope, element, attrs) ->
    if attrs.bbItem
      scope.booking_item = scope.$eval( attrs.bbItem )
    return



angular.module('BB.Controllers').controller 'PersonList',
($scope,  $rootScope, PageControllerService, PersonService, ItemService, $q, BBModel, PersonModel, FormDataStoreService) ->

  $scope.controller = "public.controllers.PersonList"

  $scope.notLoaded $scope
  angular.extend(this, new PageControllerService($scope, $q))

  $rootScope.connection_started.then ->
    loadData()
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  loadData = () ->
    $scope.booking_item ||= $scope.bb.current_item
    bi = $scope.booking_item

    # do nothing if nothing has changed
    if !bi.service || bi.service == $scope.change_watch_item
      # if there's no service - we have to wait for one to be set - so we're kind of done loadig for now!
      if !bi.service
        $scope.setLoaded $scope
      return

    $scope.change_watch_item = bi.service
    $scope.notLoaded $scope

    ppromise = PersonService.query($scope.bb.company)
    ppromise.then (people) ->
      if bi.group # check they're part of any currently selected group
        people = people.filter (x) -> !x.group_id || x.group_id == bi.group
      $scope.all_people = people

    ItemService.query(
      company: $scope.bb.company
      cItem: bi
      wait: ppromise
      item: 'person'
    ).then (items) ->
      if bi.group # check they're part of any currently selected group
        items = items.filter (x) -> !x.group_id || x.group_id == bi.group

      promises = []
      for i in items
        promises.push(i.promise)

      $q.all(promises).then (res) =>
        people = []
        for i in items
          people.push(i.item)
          if bi && bi.person && bi.person.self == i.item.self
            $scope.person = i.item
            $scope.selected_bookable_items = [i]
          if bi && bi.selected_person && bi.selected_person.item.self == i.item.self
            bi.selected_person = i

        # if there's only 1 person and combine resources/staff has been turned on, auto select the person
        if (items.length == 1 && $scope.bb.company.settings && $scope.bb.company.settings.merge_people)
          if !$scope.selectItem(items[0], $scope.nextRoute )
            setPerson people
            $scope.bookable_items = items
            $scope.selected_bookable_items = items
          else
            $scope.skipThisStep()
        else
          setPerson people
          $scope.bookable_items = items
          if !$scope.selected_bookable_items
            $scope.selected_bookable_items = items
        $scope.setLoaded $scope
    , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  # we're storing the person property in the form store but the angular select
  # menu has to have a reference to the same object memory address for it to
  # appear as selected as it's ng-model property is a Person object.
  setPerson = (people) ->
    $scope.bookable_people = people
    if $scope.person
        _.each people, (person) ->
          if person.id is $scope.person.id
            $scope.person = person


  getItemFromPerson = (person) =>
    if (person instanceof  PersonModel)
      if $scope.bookable_items
        for item in $scope.bookable_items
          if item.item.self == person.self
            return item
    return person


  $scope.selectItem = (item, route) =>
    if $scope.$parent.$has_page_control
      $scope.person = item
      return false
    else
      $scope.booking_item.setPerson(getItemFromPerson(item))
      $scope.decideNextPage(route)
      return true


  $scope.selectAndRoute = (item, route) =>
   $scope.booking_item.setPerson(getItemFromPerson(item))
   $scope.decideNextPage(route)
   return true


  $scope.$watch 'person',(newval, oldval) =>
    if $scope.person and $scope.booking_item
      if !$scope.booking_item.person || $scope.booking_item.person.self != $scope.person.self
        # only set and broadcast if it's changed
        $scope.booking_item.setPerson(getItemFromPerson($scope.person))
        $scope.broadcastItemUpdate()
    else if newval != oldval
      $scope.booking_item.setPerson(null)
      $scope.broadcastItemUpdate()

  $scope.$on "currentItemUpdate", (event) ->
    loadData()


  $scope.setReady = () =>
    if $scope.person
      $scope.booking_item.setPerson(getItemFromPerson($scope.person))
      return true
    else
      $scope.booking_item.setPerson(null)
      return true

