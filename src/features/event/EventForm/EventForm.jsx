/*global google*/
import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from 'revalidate';
import cuid from 'cuid';
import Script from 'react-load-script';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { createEvent, updateEvent } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;
  let event = {};
  if (eventId && state.events.length > 0) {
    event = state.events.filter(event => event.id === eventId)[0];
    //console.log(event);
  }
  return {
    initialValues: event
  };
};
const category = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
];
const actions = { createEvent, updateEvent };

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'Please provide a category' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 character'
    })
  )(),
  city: isRequired('city'),
  venue: isRequired('venue')
});
class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };
  handleScriptLoaded = () => {
    this.setState({ scriptLoaded: true });
  };
  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('city', selectedCity);
      });
  };
  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('venue', selectedVenue);
      });
  };
  onFormSubmit = values => {
    values.venueLatLng = this.state.venueLatLng;
    if (this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      const newEvent = {
        ...values,
        id: cuid,
        hostPhotoURL: '/assets/user.png',
        hostBy: 'Bob'
      };
      this.props.createEvent(newEvent);
      this.props.history.push('/events');
    }
  };
  render() {
    const { invalid, submitting, pristine } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBQLw90b1LJmr3NNLWrW5Fq_F7bOWLzCt0&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="title"
                type="text"
                placeholder="Give your event a name"
                component={TextInput}
              />
              <Field
                name="category"
                type="text"
                options={category}
                placeholder="What is your event about"
                component={SelectInput}
              />
              <Field
                name="description"
                type="text"
                placeholder="Tell us about your event"
                rows={3}
                component={TextArea}
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                type="text"
                placeholder="Event City"
                component={PlaceInput}
                options={{ types: ['(cities)'] }}
                onSelect={this.handleCitySelect}
              />
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  placeholder="Event Venue"
                  component={PlaceInput}
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    types: ['establishment']
                  }}
                  onSelect={this.handleVenueSelect}
                />
              )}
              <Field
                name="date"
                type="text"
                placeholder="Event Date"
                component={TextInput}
              />

              <Button
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
              <Button onClick={this.props.history.goBack} type="button">
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(
    EventForm
  )
);
