
angular.module('BB.Services').factory "DayService", ($q, BBModel) ->
  query: (prms) ->
    deferred = $q.defer()

    if prms.cItem.days_link
      extra = {}
      extra.month = prms.month
      extra.date = prms.date 
      extra.edate = prms.edate
      extra.location = prms.client.addressCsvLine() if prms.client
      extra.person_id = prms.cItem.person.id if prms.cItem.person && !prms.cItem.anyPerson()
      extra.resource_id = prms.cItem.resource.id if prms.cItem.resource && !prms.cItem.anyResource()

      prms.cItem.days_link.$get('days', extra).then (found) =>
        afound = found.days
        days = []
        for i in afound
          if (i.type == prms.item)
            days.push(new BBModel.Day(i))  
        deferred.resolve(days)
      , (err) =>
        deferred.reject(err)
    else
      deferred.reject("No Days Link found")

    deferred.promise
