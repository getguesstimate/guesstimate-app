
//import Auth0Variables from './auth0-variables'
import Auth0Lock from 'auth0-lock'
import React, {Component, PropTypes} from 'react'
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

  render () {
    const isLoggedIn = loggedIn(this.props.me)
    const profile = this.props.me.profile
    console.log(profile)
    return (
      <div className='ui menu'>
        { isLoggedIn &&
          <div className='ui item'>
            <img className='ui avatar image' src={profile.picture}/>{profile.name}
          </div>
        }
        { isLoggedIn &&
          <div className={'ui item'} onClick={this.logOut.bind(this)}>Log Out</div>
        }
        { !isLoggedIn &&
          <div className={'ui item'}onClick={this.signUp.bind(this)}>Sign Up</div>
        }
        { !isLoggedIn &&
          <div className={'ui item'} onClick={this.signIn.bind(this)}>Sign In</div>
        }
      </div>
    )
  }
}
