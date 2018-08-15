import React, { Component } from 'react';
import { connect } from 'react-redux';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { incrementCounter, decrementCounter } from './testActions';
import { Button } from 'semantic-ui-react';
import { openModal } from '../modals/modalActions';
const mapState = state => ({
  data: state.test.data
});

const actions = {
  incrementCounter,
  decrementCounter,
  openModal
};

class TestComponent extends Component {
  state = {
    address: '',
    ScriptLoaded: false
  };

  handleScriptLoad = () => {
    this.setState({
      ScriptLoaded: true
    });
  };
  handleFormSubmit = event => {
    event.preventDefault();

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  onChange = address => this.setState({ address });

  render() {
    const { incrementCounter, decrementCounter, openModal } = this.props;
    return (
      <div>
        <h1>test component</h1>
        <h3>The answer is: {this.props.data}</h3>
        <Button onClick={incrementCounter} color="green" content="Increment" />
        <Button onClick={decrementCounter} color="green" content="Decrement" />
        <Button
          onClick={() => openModal('TestModal', { a: 42 })}
          color="teal"
          content="OpenModal"
        />
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(TestComponent);
