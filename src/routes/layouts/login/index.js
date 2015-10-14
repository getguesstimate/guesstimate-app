
//import Auth0Variables from './auth0-variables'
import Auth0Lock from 'auth0-lock'
import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import * as meActions from 'gModules/me/actions.js'

import { connect } from 'react-redux';
const Auth0Variables = {
  AUTH0_CLIENT_ID: 'By2xEUCPuGqeJZqAFMpBlgHRqpCZelj0',
  AUTH0_DOMAIN: 'guesstimate.auth0.com'
};

const lock = new Auth0Lock(
  Auth0Variables.AUTH0_CLIENT_ID,
  Auth0Variables.AUTH0_DOMAIN
);

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

const loggedIn = (user) =>  {
  return !!(user && user.profile && user.profile.name)
}

@connect(mapStateToProps)
export default class Profile extends Component {
  displayName: 'Profile'

  signUp(){
    this.props.dispatch(meActions.signUp())
  }

  signIn(){
    this.props.dispatch(meActions.signIn())
  }

  logOut(){
    this.props.dispatch(meActions.logOut())
  }

  profileDropdown () {
    const profile = this.props.me.profile
    return (
      <div>
        <a className='ui image label'>
          <img  src={profile.picture}/>
          {profile.name}
        </a>
      </div>
    )

  }
  render () {
    const isLoggedIn = loggedIn(this.props.me)
    return (
    <div className='right menu'>

      { isLoggedIn &&
        <div className='ui item'>
          <StandardDropdownMenu toggleButton={this.profileDropdown()}>
            <li key='1' onMouseDown={this.logOut.bind(this)}><a className='ui item'>Log Out</a></li>
          </StandardDropdownMenu>
        </div>
      }

      { !isLoggedIn &&
        <a className={'ui item'}onClick={this.signUp.bind(this)}>Sign Up</a>
      }

      { !isLoggedIn &&
        <a className={'ui item'} onClick={this.signIn.bind(this)}>Sign In</a>
      }
    </div>
    )
  }
}
