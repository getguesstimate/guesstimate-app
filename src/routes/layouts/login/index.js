
//import Auth0Variables from './auth0-variables'
import Auth0Lock from 'auth0-lock'
import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import {LinkSettings} from 'gComponents/utility/links/index.js'
import * as meActions from 'gModules/me/actions.js'
import * as modalActions from 'gModules/modal/actions.js'
import * as navigationActions from 'gModules/navigation/actions.js'
import Icon from 'react-fa'
import './style.css'
import {trackAccountModalClick, trackUserMenuOpen, trackUserMenuClose} from 'server/segment/index.js'
import * as spaceActions from 'gModules/spaces/actions.js'

import { connect } from 'react-redux';


@connect()
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

  newModel(){
    this.props.dispatch(spaceActions.create())
  }

  _openModal() {
    trackAccountModalClick()
    this.props.dispatch(modalActions.openSettings())
  }

  profileDropdown() {
    const profile = this.props.me.profile
    const portalUrl = _.get(profile, 'account._links.payment_portal.href')

    let listElements = [
      {ionicIcon: 'md-person', header: 'account', onMouseDown: this._openModal.bind(this)},
      {icon: 'rocket', header: 'upgrade', onMouseDown: () => {navigationActions.navigate('/pricing')}},
      {ionicIcon: 'md-help', header: 'FAQ', onMouseDown: () => {navigationActions.navigate('/faq')}},
      {ionicIcon: 'md-log-out', header: 'Sign Out', onMouseDown: this.logOut.bind(this)}
    ]

    if (!!portalUrl) {
      listElements = [listElements[0], listElements[2], listElements[3]]
    }

    return (
      <div className='item'>
        <DropDown
            headerText={profile.name}
            openLink={<img className='avatar' src={profile.picture}/>}
            onOpen={trackUserMenuOpen}
            onClose={trackUserMenuClose}
            ref='dropdown'
        >
          <ul>
            {listElements.map(props => <DropDownListElement {...props} key={props.icon} closeOnClick={true} dropDown={this.refs.dropdown}/>)}
          </ul>
        </DropDown>
      </div>
    )

  }

  newModelDropdown() {
    const organizations = []
    let listElements = [
      {header: 'Personal', onMouseDown: this.newModel.bind(this)},
    ]
    return (
        <DropDown
          headerText={'Create a Model'}
          openLink={<a className='item'> <i className={`ion-md-add`}/> <span className='text'>New Model</span> </a>}
          ref='new-model'
        >
          <ul>
            {listElements.map(element => <DropDownListElement {...element} closeOnClick={true} dropDown={this.refs.dropdown}/>)}
          </ul>
        </DropDown>
    )
  }

  render () {
    const {me, isLoggedIn} = this.props
    const hasOrganizations = true

    return (
    <div className='header-right-menu'>

      { isLoggedIn && hasOrganizations && this.newModelDropdown() }
      { isLoggedIn && !hasOrganizations &&
        <a className='item' onClick={this.newModel.bind(this)}>
          <i className={`ion-md-add`}/>
          <span className='text'>New Model</span>
        </a>
      }

      { isLoggedIn && me.id &&
        <a className='item' href={`/users/${me.id}`}>
          <i className={`ion-md-albums`}/>
          <span className='text'>My Models</span>
        </a>
      }

      { isLoggedIn && this.profileDropdown() }

      { !isLoggedIn &&
        <a className={'item text'} href='/pricing'>Plans</a>
      }

      { !isLoggedIn &&
        <a className={'item text'} href='/models'>Explore</a>
      }

      { !isLoggedIn &&
        <a className={'item text'} onClick={this.signIn.bind(this)}>Sign In</a>
      }

      { !isLoggedIn &&
        <a className={'item text'} onClick={this.signUp.bind(this)}>Sign Up</a>
      }
    </div>
    )
  }
}
