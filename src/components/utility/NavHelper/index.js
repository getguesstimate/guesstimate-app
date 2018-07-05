import app from 'ampersand-app'
import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import localLinks from 'local-links'
import * as modalActions from 'gModules/modal/actions.js'
import {connect} from 'react-redux';
import $ from 'jquery'

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

  componentDidMount(){
    $(document).on('keydown', (e) => {
      if (e.which === 8 && $(e.target).is('body')) {
        e.preventDefault();
      }
    });
  }

  render () {
    return (
      <div className='navHelper' onClick={this.onClick.bind(this)}>
        {this.props.children}
      </div>
    )
  }
}
