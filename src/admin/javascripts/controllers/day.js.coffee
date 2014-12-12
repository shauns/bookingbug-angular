'use strict'

angular.module('BBAdmin.Controllers').controller 'DashDayList', ($scope,  $rootScope, $q, AdminDayService) ->

  $scope.init = (company_id) =>
    $scope.inline_items = ""
    if company_id
      $scope.bb.company_id = company_id
    if !$scope.current_date
      $scope.current_date = moment().startOf('month')
    date = $scope.current_date
    prms = {date:date.format('DD-MM-YYYY'), company_id:$scope.bb.company_id}
    if ($scope.service_id)
      prms.service_id = $scope.service_id
    if ($scope.end_date)
      prms.edate = $scope.end_date.format('DD-MM-YYYY')

    # create a promise for the weeks and go get the days!
    dayListDef = $q.defer()
    weekListDef = $q.defer()
    $scope.dayList = dayListDef.promise
    $scope.weeks = weekListDef.promise
    prms.url = $scope.bb.api_url

    AdminDayService.query(prms).then (days) =>
      $scope.sdays = days
      dayListDef.resolve()
      if $scope.category
        $scope.update_days()

  $scope.format_date = (fmt) =>
    $scope.current_date.format(fmt)

  $scope.selectDay = (day, dayBlock, e) =>
    if (day.spaces == 0)
      return false
    seldate = moment($scope.current_date)
    seldate.date(day.day)
    $scope.selected_date = seldate

    elm  = angular.element(e.toElement)
    elm.parent().children().removeClass("selected")
    elm.addClass("selected")
    xelm = $('#tl_' + $scope.bb.company_id)
    $scope.service_id = dayBlock.service_id
    $scope.service = {id: dayBlock.service_id, name: dayBlock.name}
    $scope.selected_day = day
    if xelm.length== 0
      $scope.inline_items = "/view/dash/time_small"
    else
      xelm.scope().init(day)

  $scope.$watch 'current_date', (newValue, oldValue) =>
    if newValue && $scope.bb.company_id
      $scope.init()

  $scope.update_days = =>
    $scope.dayList = []
    $scope.service_id = null

    for day in $scope.sdays
      if day.category_id == $scope.category.id
        $scope.dayList.push(day)
        $scope.service_id = day.id


  $rootScope.$watch 'category', (newValue, oldValue) =>
    if newValue &&  $scope.sdays
      $scope.update_days()


