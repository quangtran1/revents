import React, { Component } from 'react';
import { connect } from 'react-redux';
import { incrementCounter, decrementCounter } from './testActions';
import { Button } from 'semantic-ui-react';
const mapState = state => ({
  data: state.test.data
});

const actions = {
  incrementCounter,
  decrementCounter
};
class TestComponent extends Component {
  render() {
    const { incrementCounter, decrementCounter } = this.props;
    return (
      <div>
        <h1>test component</h1>
        <h3>The answer is: {this.props.data}</h3>
        <Button onClick={incrementCounter} color="green" content="Increment" />
        <Button onClick={decrementCounter} color="green" content="Decrement" />
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(TestComponent);
