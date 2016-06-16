import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import './style.css'
import Icon from 'react-fa'
import Card from 'gComponents/utility/card/index.js'
import Plan from 'lib/config/plan.js'

const PlanC = ({planId, privateModelLimit}) => (
  <div className='Plan'>
    <h2> {Plan.find(planId).fullName()} </h2>
    <p> {`${Plan.find(planId).number()} Private Models`}</p>
  </div>
)

const PlanUpgradeButton = () => (
  <a className='ui button green large' href={'/subscribe/lite'}>
    <Icon name='rocket'/>
    {'  Upgrade'}
  </a>
)

// The portal url only can be clicked once.  Then,we need a new one.
const PortalButton = ({url, onRefresh}) => (
  <a className='ui button black portal' href={url} target='_blank' onMouseUp={onRefresh}>
    {'Edit Plan & Payment Details'}
  </a>
)

const PlanUpgradeSection = ({planId, portalUrl, onRefresh}) => {
  const hasPortalUrl = !!portalUrl
  if (planId === 'personal_infinite') { return <div/> }
  else {
    return (
      <div>
        <hr/>
        <div className='Settings-Upgrade'>
          {!hasPortalUrl && <PlanUpgradeButton/>}
          {hasPortalUrl && <PortalButton url={portalUrl} onRefresh={onRefresh}/>}
        </div>
      </div>
    )
  }
}

export default class Settings extends Component{
  displayName: 'Settings'

  static defaultProps = {
    planId: false,
  }

  render () {
    const {planId, portalUrl, onRefresh} = this.props

    return (
      <div className='Settings'>
        {!_.isEmpty(planId) &&
          <div className='ModalMedium'>
            <Card
              headerText={'Account'}
              onClose={this.props.onClose}
              width={'normal'}
              hasPadding={true}
              shadow={true}
            >
              <div>
                <div className='Settings-Plan'>
                  <PlanC planId={planId} privateModelLimit={0}/>
                </div>

                <PlanUpgradeSection planId={planId} portalUrl={portalUrl} onRefresh={onRefresh}/>
              </div>
            </Card>
          </div>
        }
      </div>
    )
  }
}
