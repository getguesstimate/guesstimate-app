import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import Settings from './Settings.js'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class SettingsContainer extends Component{
  displayName: 'SettingsContainer'
  render() {
    const {me} = this.props
    const portalUrl = _.get(me, 'profile.account._links.payment_portal.href')
    const planId = _.get(me, 'profile.plan.id')
    return (
      <Settings
        planId={planId}
        portalUrl={portalUrl}
      />
    )
  }
}
