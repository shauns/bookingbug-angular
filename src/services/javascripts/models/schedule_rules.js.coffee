'use strict'

angular.module('BB.Models').factory "ScheduleRules", () ->

  class ScheduleRules

    constructor: (rules = {}) ->
      @rules = rules

    addWeekdayRange: (start, end) ->
      days = @diffInDays(start, end)
      if days == 0
        day = start.format('d')
        ranges = if @rules[day] then @rules[day].split(',') else []
        range = [start.format('HHmm'), end.format('HHmm')].join('-')
        @rules[day] = @joinRanges(@insertRange(ranges, range))
      else
        for i in [0..days]
          date = moment(start).add(i, 'days')
          if i == 0
            @addRange(start, moment(start).endOf('day'))
          else if i == days
            @addRange(moment(end).startOf('day'), end)
          else
            @rules[date.format('d')] = '0000-2359'
      @rules

    addRange: (start, end) ->
      days = @diffInDays(start, end)
      if days == 0
        date = start.format('YYYY-MM-DD')
        ranges = if @rules[date] then @rules[date].split(',') else []
        range = [start.format('HHmm'), end.format('HHmm')].join('-')
        @rules[date] = @joinRanges(@insertRange(ranges, range))
      else
        for i in [0..days]
          date = moment(start).add(i, 'days')
          if i == 0
            @addRange(start, moment(start).endOf('day'))
          else if i == days
            @addRange(moment(end).startOf('day'), end)
          else
            @rules[date.format('YYYY-MM-DD')] = '0000-2359'
      @rules

    removeRange: (start, end) ->
      days = @diffInDays(start, end)
      if days == 0
        date = start.format('YYYY-MM-DD')
        ranges = if @rules[date] then @rules[date].split(',') else []
        range = [start.format('HHmm'), end.format('HHmm')].join('-')
        @rules[date] = @joinRanges(_.without(ranges, range))
        delete @rules[date] if @rules[date] == ''
      else
        for i in [0..days]
          date = moment(start).add(i, 'days')
          if i == 0
            @removeRange(start, moment(start).endOf('day'))
          else if i == days
            @removeRange(moment(end).startOf('day'), end)
          else
            delete @rules[date.format('YYYY-MM-DD')]
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

