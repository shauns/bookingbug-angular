
angular.module('BB.Services').factory "CustomTextService",  ($q, BBModel) ->
  BookingText: (company, basketItem) ->
    deferred = $q.defer()
    company.$get('booking_text').then (emb) =>
      emb.$get('booking_text').then (details) =>
        msgs = []
        for detail in details
          if detail.message_type == "Booking"
            for name, link of basketItem.parts_links
              if detail.$href('item') == link
                if msgs.indexOf(detail.message) == -1
                  msgs.push(detail.message)
        deferred.resolve(msgs)
    , (err) =>
      deferred.reject(err)
    deferred.promise

  confirmationText: (company, total) ->
    deferred = $q.defer()
    company.$get('booking_text').then (emb) ->
      emb.$get('booking_text').then (details) ->
        total.getMessages(details, "Confirm").then (msgs) ->
          deferred.resolve(msgs)
    , (err) ->
      deferred.reject(err)
    deferred.promise
