# Filters
app = angular.module 'BB.Filters'


app.filter 'dayName', ->
  (day_of_week) ->
    date = moment().weekday(day_of_week)
    return date.format('ddd')


app.filter 'hourName', ->
  (timestamp) ->
    timestamp = timestamp.substring(0,5)
    date = moment(timestamp, 'HH:mm')
    return date.format('ha')
