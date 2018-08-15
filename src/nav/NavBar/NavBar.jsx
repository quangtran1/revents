import React, { Component } from 'react';
import { Menu, Button, Container } from 'semantic-ui-react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SignedInMenu from '../Menus/SignedInMenu';
import SignedOutMenu from '../Menus/SignedOutMenu';
import { openModal } from '../../features/modals/modalActions';
import { logout } from '../../features/oauth/authActions';
const mapState = state => ({
  auth: state.auth
});

const actions = {
  openModal,
  logout
};

class NavBar extends Component {
  handleSignIn = () => {
    this.props.openModal('LoginModal');
  };
  handleRegister = () => {
    this.props.openModal('RegisterModal');
  };
  handleSignOut = () => {
    this.props.logout();
    this.props.history.push('/');
  };
  render() {
    const { auth } = this.props;
    const authenticated = auth.authenticated;
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} to="/events" name="Events" />
          <Menu.Item as={NavLink} to="/test" name="Test" />
          <Menu.Item as={NavLink} to="/people" name="People" />
          {authenticated && (
            <Menu.Item>
              <Button
                as={Link}
                to="/createEvent"
                floated="right"
                positive
                inverted
                content="Create Event"
              />
            </Menu.Item>
          )}
          {authenticated ? (
            <SignedInMenu
              currentUser={auth.currentUser}
              EventSignOut={this.handleSignOut}
            />
          ) : (
            <SignedOutMenu
              EventSignIn={this.handleSignIn}
              register={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(
  connect(
    mapState,
    actions
  )(NavBar)
);
