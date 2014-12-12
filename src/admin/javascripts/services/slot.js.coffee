

angular.module('BBAdmin.Services').factory 'AdminSlotService',
($q, $window, halClient, SlotCollections, BBModel) ->

  query: (prms) ->
    deferred = $q.defer()

    # see if a colection of slots matching this quesry is already being monitored
    existing = SlotCollections.find(prms)
    if existing
      deferred.resolve(existing)
    else
      url = ""
      url = prms.url if prms.url
      href = url + "/api/v1/admin/{company_id}/slots{?start_date,end_date,service_id,resource_id,person_id,page,per_page}"
      uri = new $window.UriTemplate.parse(href).expand(prms || {})

      halClient.$get(uri, {}).then  (found) =>
        found.$get('slots').then (items) =>
          sitems = []
          for item in items
            sitems.push(new BBModel.Admin.Slot(item))
          slots  = new $window.Collection.Slot(found, sitems, prms)
          SlotCollections.add(slots)
          deferred.resolve(slots)
      , (err) =>
        deferred.reject(err)

    deferred.promise


  create: (prms, data) ->

    url = ""
    url = prms.url if prms.url
    href = url + "/api/v1/admin/{company_id}/slots"
    uri = new $window.UriTemplate.parse(href).expand(prms || {})

    deferred = $q.defer()

    halClient.$post(uri, {}, data).then  (slot) =>
      slot = new BBModel.Admin.Slot(slot)
      SlotCollections.checkItems(slot)
      deferred.resolve(slot)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  delete: (item) ->

    deferred = $q.defer()
    item.$del('self').then  (slot) =>
      slot = new BBModel.Admin.Slot(slot)
      SlotCollections.deleteItems(slot)
      deferred.resolve(slot)
    , (err) =>
      deferred.reject(err)

    deferred.promise

  update: (item, data) ->

    deferred = $q.defer()
    item.$put('self', {}, data).then  (slot) =>
      slot = new BBModel.Admin.Slot(slot)
      SlotCollections.checkItems(slot)
      deferred.resolve(slot)
    , (err) =>
      deferred.reject(err)

    deferred.promise