
//import Auth0Variables from './auth0-variables'
import Auth0Lock from 'auth0-lock'
import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import * as meActions from 'gModules/me/actions.js'
import Icon from 'react-fa'
import './style.css'

import { connect } from 'react-redux';

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
      <a className='item'>
        <img className='avatar' src={profile.picture}/>
      </a>
    )

  }
  render () {
    const isLoggedIn = loggedIn(this.props.me)
    return (
    <div className='header-right-menu'>

      { isLoggedIn &&
        <a className='item' href={`/space/new`}><Icon name='plus'/></a>
      }

      { isLoggedIn &&
        <a className='item' href={`/users/${this.props.me.id}`}>
          <Icon name='th-large'/>
        </a>
      }

      { isLoggedIn &&
          <StandardDropdownMenu toggleButton={this.profileDropdown()}>
            <li key='1'><a className='ui item' href={`/users/${this.props.me.id}`}>Profile</a></li>
            <li key='2' onMouseDown={this.logOut.bind(this)}><a className='ui item'>Log Out</a></li>
          </StandardDropdownMenu>
      }

      { !isLoggedIn &&
        <a className={'item'}onClick={this.signUp.bind(this)}>Sign Up</a>
      }

      { !isLoggedIn &&
        <a className={'item'} onClick={this.signIn.bind(this)}>Sign In</a>
      }
    </div>
    )
  }
}
