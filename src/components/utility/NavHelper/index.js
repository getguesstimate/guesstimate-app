import app from 'ampersand-app'
import React, {Component, PropTypes} from 'react'
import localLinks from 'local-links'
import * as modalActions from 'gModules/modal/actions.js'
import {connect} from 'react-redux';

@connect()
export default class NavHelper extends Component{
  displayName: 'NavHelper'

  onClick (event) {
    const pathname = localLinks.getLocalPathname(event)

    if (pathname) {
      event.preventDefault()
      app.router.history.navigate(pathname)
      this.props.dispatch(modalActions.close())
    }
  }

  render () {
    return (
      <div className='navHelper' onClick={this.onClick.bind(this)}>
        {this.props.children}
      </div>
    )
  }
}
