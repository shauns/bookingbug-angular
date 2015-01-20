# returns date as an ISO8601 date (YYYY-MM-DD)
moment.fn.toISODate = () ->
  moment.toISODate(this)

# returns date as an ISO8601 date (YYYY-MM-DD)
moment.toISODate = (m) ->
  m.toISOString().substr(0, 10)
