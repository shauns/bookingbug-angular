'use strict'

angular.module('BB.Models').factory "ScheduleRules", () ->

  class ScheduleRules

    constructor: (rules = {}) ->
      @rules = rules

    addRange: (start, end) ->
      @applyFunctionToDateRange(start, end, 'YYYY-MM-DD', @addRangeToDate)

    removeRange: (start, end) ->
      @applyFunctionToDateRange(start, end, 'YYYY-MM-DD', @removeRangeFromDate)

    addWeekdayRange: (start, end) ->
      @applyFunctionToDateRange(start, end, 'd', @addRangeToDate)

    addRangeToDate: (date, range) =>
      ranges = if @rules[date] then @rules[date].split(',') else []
      @rules[date] = @joinRanges(@insertRange(ranges, range))

    removeRangeFromDate: (date, range) =>
      ranges = if @rules[date] then @rules[date].split(',') else []
      @rules[date] = @joinRanges(_.without(ranges, range))
      delete @rules[date] if @rules[date] == ''

    applyFunctionToDateRange: (start, end, format, func) ->
      days = @diffInDays(start, end)
      if days == 0
        date = start.format(format)
        range = [start.format('HHmm'), end.format('HHmm')].join('-')
        func(date, range)
      else
        end_time = moment(start).endOf('day')
        @applyFunctionToDateRange(start, end_time, format, func)
        _.each([1..days], (i) =>
          date = moment(start).add(i, 'days')
          if i == days
            unless end.hour() == 0 && end.minute() == 0
              start_time = moment(end).startOf('day')
              @applyFunctionToDateRange(start_time, end, format, func)
          else
            start_time = moment(date).startOf('day')
            end_time = moment(date).endOf('day')
            @applyFunctionToDateRange(start_time, end_time, format, func)
        )
      @rules

    diffInDays: (start, end) ->
      moment.duration(end.diff(start)).days()

    insertRange: (ranges, range) ->
      ranges.splice(_.sortedIndex(ranges, range), 0, range)
      ranges

    joinRanges: (ranges) ->
      _.reduce(ranges, (m, range) ->
        if m == ''
          range
        else if range.slice(0, 4) <= m.slice(m.length - 4, m.length)
          m.slice(0, m.length - 4) + range.slice(5, 9)
        else
          [m,range].join()
      , "")

    filterRulesByDates: () ->
      _.pick @rules, (value, key) ->
        key.match(/^\d{4}-\d{2}-\d{2}$/)

    filterRulesByWeekdays: () ->
      _.pick @rules, (value, key) ->
        key.match(/^\d$/)

    formatTime: (time) ->
      [time[0..1],time[2..3]].join(':')

    toEvents: () ->
      _.reduce(@filterRulesByDates(), (memo, ranges, date) =>
        memo.concat(_.map(ranges.split(','), (range) =>
          start: [date, @formatTime(range.split('-')[0])].join('T')
          end: [date, @formatTime(range.split('-')[1])].join('T')
        ))
      ,[])

    toWeekdayEvents: () ->
      _.reduce(@filterRulesByWeekdays(), (memo, ranges, day) =>
        date = moment().set('day', day).format('YYYY-MM-DD')
        memo.concat(_.map(ranges.split(','), (range) =>
          start: [date, @formatTime(range.split('-')[0])].join('T')
          end: [date, @formatTime(range.split('-')[1])].join('T')
        ))
      ,[])

