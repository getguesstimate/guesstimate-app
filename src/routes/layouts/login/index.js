
//import Auth0Variables from './auth0-variables'
import Auth0Lock from 'auth0-lock'
import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
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
      <div className='item'>
        <DropDown
            headerText={profile.name}
            openLink={<img className='avatar' src={profile.picture}/>}
        >
          <ul>
            <DropDownListElement key='1' icon='question' text='FAQ' url='https://github.com/getguesstimate/guesstimate-app'/>
            <DropDownListElement key='2' icon='sign-out' text='Sign Out' onMouseDown={this.logOut.bind(this)}/>
          </ul>
        </DropDown>
      </div>
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

      { isLoggedIn && this.profileDropdown() }

      { !isLoggedIn &&
        <a className={'item text'} onClick={this.signIn.bind(this)}>Sign In</a>
      }

      { !isLoggedIn &&
        <a className={'item text'}onClick={this.signUp.bind(this)}>Sign Up</a>
      }
    </div>
    )
  }
}
