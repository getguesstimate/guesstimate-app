import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import './style.css'
import Icon from 'react-fa'
import Card from 'gComponents/utility/card/index.js'
import Plan from 'lib/config/plan.js'

const PlanF = ({planId, privateModelLimit}) => (
  <div className='Plan'>
    <h2> {Plan.find(planId).fullName()} </h2>
    <p> {`${Plan.find(planId).number()} Private Models`}</p>
  </div>
)

const PlanUpgradeButton = () => (
  <a className='ui button green large'>
    <Icon name='rocket'/>
    {'  Upgrade'}
  </a>
)

const PortalButton = ({url}) => (
  <a className='ui button green' href={url} target='_blank'>
    {'Edit Plan & Payment Details'}
  </a>
)

const PlanUpgradeSection = ({planId, portalUrl}) => {
  const hasPortalUrl = !_.isString(portalUrl)
  if (planId === 'personal_infinite') { return <div/> }
  else {
    return (
      <div>
        <hr/>
        <div className='Settings-Upgrade'>
          {hasPortalUrl && <PlanUpgradeButton/>}
          {!hasPortalUrl && <PortalButton url={portalUrl}/>}
        </div>
      </div>
    )
  }
}

export default class Settings extends Component{
  displayName: 'Settings'

  static defaultProps = {
    planId: 'private_small',
  }

  _close() {
    console.log('closing')
  }

  render () {
    const {planId, portalUrl} = this.props

    return (
      <div className='Settings'>
        <div className='ModalMedium'>
          <Card
            headerText={'Settings'}
            onClose={this._close.bind(this)}
            width={'normal'}
            hasPadding={true}
            shadow={true}
          >
            <div>
              <div className='Settings-Plan'>
                <PlanF planId={planId} privateModelLimit={0}/>
              </div>

              <PlanUpgradeSection planId={planId} portalUrl={portalUrl}/>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}
