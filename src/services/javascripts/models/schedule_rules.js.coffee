'use strict'

angular.module('BB.Models').factory "ScheduleRules", () ->

  class ScheduleRules

    constructor: (rules) ->
      @rules = rules

    addRange: (start, end) ->
      start_time = start.format('HHmm')
      end_time = end.format('HHmm')
      @rules = _.reduce(_.range(@diffInDays(start, end) + 1), (rules, i) =>
        date = moment(start).add(i, 'days').format('YYYY-MM-DD')
        if i == 0
          if @diffInDays(start, end) >= 1
            rules[date] = @addNewRange(rules[date], [start_time,'2400'].join('-'))
          else
            rules[date] = @addNewRange(rules[date], [start_time,end_time].join('-'))
        else if date == end.format('YYYY-MM-DD')
          rules[date] = @addNewRange(rules[date], ['0000',end_time].join('-'))
        else
          rules[date] = '0000-2400'
        rules
      , @rules)

    removeRange: (start, end) ->
      start_time = start.format('HHmm')
      end_time = end.format('HHmm')
      @rules = _.reduce(_.range(@diffInDays(start, end) + 1), (rules, i) =>
        date = moment(start).add(i, 'days').format('YYYY-MM-DD')
        if i == 0
          if @diffInDays(start, end) >= 1
            rules[date] = @removeNewRange(rules[date], [start_time,'2400'].join('-'))
          else
            rules[date] = @removeNewRange(rules[date], [start_time,end_time].join('-'))
        else if date == end.format('YYYY-MM-DD')
          rules[date] = @removeNewRange(rules[date], ['0000',end_time].join('-'))
        else
          rules[date] = '0000-2400'
        delete rules[date] if rules[date] == ""
        rules
      , @rules)

    diffInDays: (start, end) ->
      moment.duration(end.diff(start)).days()

    insertRange: (ranges, range) ->
      ranges.splice(_.sortedIndex(ranges, range), 0, range)
      ranges

    joinRanges: (ranges) ->
      _.reduce(ranges, (m, range) ->
        if m == ""
          range
        else if range.slice(0, 4) <= m.slice(m.length - 4, m.length)
          m.slice(0, m.length - 4) + range.slice(5, 9)
        else
          [m,range].join()
      , "")

    addNewRange: (ranges = "", range) ->
      @joinRanges(@insertRange(ranges.split(','), range))

    removeNewRange: (ranges = "", range) ->
      @joinRanges(_.without(ranges.split(','), range))

    filterRulesByDates: () ->
      _.pick @rules, (value, key) ->
        key.match(/^\d{4}-\d{2}-\d{2}$/)

    formatTime: (time) ->
      [time[0..1],time[2..3]].join(':')

    toEvents: () ->
      _.reduce(@filterRulesByDates(), (memo, ranges, date) =>
        memo.concat(_.map(ranges.split(','), (range) =>
          start: [date, @formatTime(range.split('-')[0])].join('T')
          end: [date, @formatTime(range.split('-')[1])].join('T')
        ))
      ,[])

