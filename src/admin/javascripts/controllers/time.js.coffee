'use strict';

angular.module('BBAdmin.Controllers').controller 'DashTimeList', ($scope,  $rootScope, $location, $q, $element, AdminTimeService) ->

  $loaded = null # has somethign been loaded

  # Add a method that will be available in all retrieved CreditCard objects :
  $scope.init = (day) =>
    $scope.selected_day = day
    elem = angular.element($element)
    elem.attr('id', "tl_" + $scope.bb.company_id)
    angular.element($element).show();

    prms = {company_id:$scope.bb.company_id, day: day}
    if $scope.service_id
      prms.service_id = $scope.service_id

    timeListDef = $q.defer()
    $scope.slots = timeListDef.promise
    prms.url = $scope.bb.api_url

    $scope.aslots = AdminTimeService.query(prms)
    $scope.aslots.then (res) =>
      $scope.loaded = true
      slots = {}
      for x in res
        if !slots[x.time]
          slots[x.time] = x
      xres = []
      for k, slot of slots
        xres.push(slot)
      timeListDef.resolve(xres)

  if $scope.selected_day
    $scope.init($scope.selected_day)

  $scope.format_date = (fmt) =>
    $scope.selected_date.format(fmt)

  $scope.selectSlot = (slot, route) =>
    $scope.pickTime(slot.time)
    $scope.pickDate($scope.selected_date)
    $location.path(route)

  $scope.highlighSlot = (slot) =>
    $scope.pickTime(slot.time)
    $scope.pickDate($scope.selected_date)
    $scope.setCheckout(true)

  $scope.clear = () =>
    $scope.loaded = false
    $scope.slots = null
    angular.element($element).hide()

  $scope.popupCheckout = (slot) =>
    item = {
      time: slot.time,
      date: $scope.selected_day.date,
      company_id: $scope.bb.company_id,
      duration: 30,
      service_id: $scope.service_id,
      event_id: slot.id
    }
    url = "/booking/new_checkout?"
    for k,v of item
      url += (k + "=" + v + "&")
    wWidth = $(window).width()
    dWidth = wWidth * 0.8
    wHeight = $(window).height()
    dHeight = wHeight * 0.8
    dlg = $( "#dialog-modal" )
    src =
    dlg.html("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=100% height=99% src='" + url + "'></iframe>")
    dlg.attr("title", "Checkout")
    dlg.dialog {
      my:"top", at: "top",
      height: dHeight,
      width:dWidth,
      modal: true,
      overlay: { opacity: 0.1, background: "black" },
    }



###
  var sprice = "&price=" + price;
  var slen = "&len=" + len
  var sid = "&event_id=" + id
  var str = pop_click_str + sid + slen + sprice + "&width=800"; // + "&style=wide";
= "/booking/new_checkout?" + siarray + sjd + sitime ;

function show_IFrame(myUrl, options, width, height){
  if (!height) height = 500;
  if (!width) width = 790;
  opts = Object.extend({className: "white", pctHeight:1, width:width+20,top:'5%', height:'90%',closable:true, recenterAuto:false}, options || {});
  x = Dialog.info("", opts);
    x.setHTMLContent("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=" + width + " height=96%" + " src='" + myUrl + "'></iframe>");
  x.element.setStyle({top:'5%'});
  x.element.setStyle({height:'90%'});
}
###