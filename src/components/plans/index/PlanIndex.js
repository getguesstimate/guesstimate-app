import React, {Component, PropTypes} from 'react'
import Plans from './plans.js'

class PortalMessage extends Component{
  render() {
    const {portalUrl} = this.props
    if (!!portalUrl) {
      return (
        <div className='portal-message-container'>
          <div className='portal-message'>
            <h2>{'Go to the portal to change plans & payment'}</h2>
            <a className='ui button large primary'
              href={portalUrl}
              target='_blank'
            >
              Go to Portal
            </a>
          </div>
        </div>
      )
    } else {
      return false
    }
  }
}

export default class PlanIndex extends Component{
  displayName: 'PlanIndex'
  render () {
    const {userPlanId, portalUrl} = this.props
    const showButtons = (userPlanId === 'personal_free') && !portalUrl

    return (
      <div className='PlanIndex'>
        <div className='header'>
          <h1> Plans & Pricing </h1>
        </div>

        <PortalMessage portalUrl={portalUrl}/>

        <div className='cards'>
          <Plans showButtons={showButtons}/>
        </div>
      </div>
    )
  }
}
