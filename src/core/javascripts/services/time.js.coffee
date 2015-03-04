

angular.module('BB.Services').factory "TimeService", ($q, BBModel, halClient) ->
  query: (prms) ->
    deferred = $q.defer()

    if prms.date
      date = prms.date.toISODate()
    else
      if !prms.cItem.date
        deferred.reject("No date set")
        return deferred.promise
      else
        date = prms.cItem.date.date.toISODate()

    # if there was no duration passed in get the default duration off the
    # current item
    if !prms.duration?
      prms.duration = prms.cItem.duration if prms.cItem && prms.cItem.duration

    item_link = prms.item_link
    if prms.cItem && prms.cItem.days_link && !item_link
      item_link = prms.cItem.days_link

    if item_link
      extra = {date: date}
      # extra.location = prms.client.addressCsvLine() if prms.client && prms.client.hasAddress()
      extra.location = prms.location if prms.location
      extra.event_id = prms.cItem.event_id if prms.cItem.event_id
      extra.person_id = prms.cItem.person.id if prms.cItem.person && !prms.cItem.anyPerson() && !item_link.event_id && !extra.event_id
      extra.resource_id = prms.cItem.resource.id if prms.cItem.resource && !prms.cItem.anyResource() && !item_link.event_id  && !extra.event_id
      extra.end_date = prms.end_date.toISODate() if prms.end_date
      extra.duration = prms.duration
      extra.num_resources = prms.num_resources

      # if we have an event - the the company link - so we don't add inb extra params
      item_link = prms.company if extra.event_id
      item_link.$get('times', extra).then (results) =>
        if results.$has('date_links')
          # it's a date range - we're expecting several dates - lets build up a hash of dates
          results.$get('date_links').then (all_days) =>
            date_times = {}
            all_days_def = []
            for day in all_days
              do (day) =>
                # there's several days - get them all
                day.elink = $q.defer()
                all_days_def.push(day.elink.promise)
                if day.$has('event_links')
                  day.$get('event_links').then (all_events) =>
                    times = @merge_times(all_events, prms.cItem.service, prms.cItem)
                    times = _.filter(times, (t) -> t.avail >= prms.available) if prms.available
                    date_times[day.date] = times
                    day.elink.resolve()
                else if day.times
                  times = @merge_times([day], prms.cItem.service, prms.cItem)
                  times = _.filter(times, (t) -> t.avail >= prms.available) if prms.available
                  date_times[day.date] = times
                  day.elink.resolve()

            $q.all(all_days_def).then () ->
              deferred.resolve(date_times)

        else if results.$has('event_links')
          # single day - but a list of bookable events
          results.$get('event_links').then (all_events) =>
            times = @merge_times(all_events, prms.cItem.service, prms.cItem)
            times = _.filter(times, (t) -> t.avail >= prms.available) if prms.available
            deferred.resolve(times)

        else if results.times
          times = @merge_times([results], prms.cItem.service, prms.cItem)
          times = _.filter(times, (t) -> t.avail >= prms.available) if prms.available
          deferred.resolve(times)
      , (err) ->
        deferred.reject(err)

    else
      deferred.reject("No day data")
    deferred.promise


  merge_times: (all_events, service, item) ->
    return [] if !all_events || all_events.length == 0

    sorted_times = []
    for ev in all_events
      if ev.times
        for i in ev.times
          # set it not set, currently unavailable, or randomly based on the number of events
          if !sorted_times[i.time] || sorted_times[i.time].avail == 0 || (Math.floor(Math.random()*all_events.length) == 0 && i.avail > 0)
            i.event_id = ev.event_id
            sorted_times[i.time] = i
        # if we have an item - which an already booked item - make sure that it's the list of time slots we can select - i.e. that we can select the current slot
        @checkCurrentItem(item.held, sorted_times, ev) if item.held
        @checkCurrentItem(item, sorted_times, ev)

    times = []
    date_times = {}
    for i in sorted_times
      if i
        times.push(new BBModel.TimeSlot(i, service))
    times


  checkCurrentItem: (item, sorted_times, ev) ->
    if item && item.id && item.event_id == ev.event_id && item.time && !sorted_times[item.time.time] && item.date && item.date.date.toISODate() == ev.date
      sorted_times[item.time.time] = item.time
      # remote this entry from the cache - just in case - we know it has a held item in it so lets just not keep it in case that goes later!
      halClient.clearCache(ev.$href("self"))
    else if item && item.id && item.event_id == ev.event_id && item.time && sorted_times[item.time.time] && item.date && item.date.date.toISODate() == ev.date
      sorted_times[item.time.time].avail = 1
