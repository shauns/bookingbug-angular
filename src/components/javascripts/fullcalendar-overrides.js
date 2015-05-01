if ($.fullCalendar.Grid){

$.fullCalendar.Grid.prototype.bindHandlers = function() {
  var noEventClick = this.view.opt('noEventClick');
  var _this = this;

  // attach a handler to the grid's root element.
  // we don't need to clean up in unbindHandlers or destroy, because when jQuery removes the element from the
  // DOM it automatically unregisters the handlers.
  this.el.on('mousedown', function(ev) {
    if (
      (!$(ev.target).is('.fc-event-container *, .fc-more') || noEventClick) && // not an an event element, or "more.." link
      !$(ev.target).closest('.fc-popover').length // not on a popover (like the "more.." events one)
    ) {
      _this.dayMousedown(ev);
    }
  });

  // attach event-element-related handlers. in Grid.events
  // same garbage collection note as above.
  this.bindSegHandlers();

  $(document).on('dragstart', this.documentDragStartProxy); // jqui drag
}

$.fullCalendar.Grid.prototype.renderSelection = function(range) {
  $.fullCalendar.Grid.prototype.renderSelection.apply(this, [range]);
}

var FC = $.fullCalendar;
var agendaSelectAcrossWeek = FC.views.agenda.extend({

  initialize: function() {
    FC.views.agenda.prototype.initialize.apply(this);
    this.timeGrid.renderSelection = this.renderSelection;
  },

  splitRange: function(range) {
    var start = range.start;
    var end = range.end;
    days = moment.duration(end.diff(start)).days()
    return _.map(_.range(days + 1), function(i) {
      day = moment(start).add(i, 'days');
      return {
        start: day.set({'hour': start.hour(), 'minute': start.minute()}),
        end: moment(day).set({'hour': end.hour(), 'minute': end.minute()})
      };
    })
  },

  reportSelection: function(range, ev) {
    _.each(this.splitRange(range), function(r) {
      FC.views.agenda.prototype.reportSelection.apply(this, [r, ev])
    }, this);
  },

  renderSelection: function(range) {
    var ranges = this.view.splitRange(range);
    if (this.view.opt('selectHelper')) {
			_.each(ranges, this.renderRangeHelper, this);
    }
    else {
      segs = _.reduce(ranges, function(s, r) {
        return s.concat(this.rangeToSegs(r))
      }, [], this);
      this.renderFill('highlight', segs)
    }
  }

});

FC.views.agendaSelectAcrossWeek = agendaSelectAcrossWeek;

}