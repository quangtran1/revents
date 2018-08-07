import React, { Component } from 'react';
import EventListItem from './EventListItem';
class EventList extends Component {
  render() {
    const { events, onEventOpen, DeleteEvent } = this.props;
    return (
      <div>
        {events.map(event => (
          <EventListItem
            key={event.id}
            event={event}
            onEventOpen={onEventOpen}
            DeleteEvent={DeleteEvent}
          />
        ))}
      </div>
    );
  }
}
export default EventList;
