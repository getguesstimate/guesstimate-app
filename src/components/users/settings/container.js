import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Settings from './Settings.js'
import * as meActions from 'gModules/me/actions.js'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class SettingsContainer extends Component{
  displayName: 'SettingsContainer'
  _refreshMe() { this.props.dispatch(meActions.guesstimateMeLoad()) }
  render() {
    const {me} = this.props
    const portalUrl = _.get(me, 'profile.account._links.payment_portal.href')
    const planId = _.get(me, 'profile.plan.id')
    return (
      <Settings
        planId={planId}
        portalUrl={portalUrl}
        onClose={this.props.onClose}
        onRefresh={this._refreshMe.bind(this)}
      />
    )
  }
}
