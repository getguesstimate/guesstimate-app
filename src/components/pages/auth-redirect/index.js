import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PageBase from '../base/index'
import * as meActions from 'gModules/me/actions'
import app from 'ampersand-app'
import {user} from 'gEngine/engine'

const content = `
# Redirection 

## You are being redirected.
`

function mapStateToProps(state) {
  return {
    me: state.me,
  }
}

@connect(mapStateToProps)
export default class AuthRedirect extends Component{
  displayName: 'AuthRedirect'

  componentWillMount(){
    this.props.dispatch(meActions.logIn())
  }

  componentDidUpdate(){
    if (this.props.me && this.props.me.id){
      app.router.history.navigate(user.urlById(this.props.me.id))
    }
  }

  render () {
    return (
      <div>
        <PageBase content={content}/>
      </div>
    )
  }
}
