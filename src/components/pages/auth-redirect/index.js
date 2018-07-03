import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PageBase from '../base/index'
import * as meActions from 'gModules/me/actions'

const content = `
# Redirected 

## You are being redirected.
`

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    console.log(location.hash)
    // auth.handleAuthentication();
  }
}

@connect()
export default class AuthRedirect extends Component{
  displayName: 'AuthRedirect'

  auth() {
    this.props.dispatch(meActions.logIn())
  }

  render () {
    // console.log(handleAuthentication(this.props));
    this.auth()
    return (
      <div>
        <PageBase content={content}/>
      </div>
    )
  }
}
