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
