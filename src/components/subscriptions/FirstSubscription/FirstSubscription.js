import React, {Component, PropTypes} from 'react'
import {subStages} from 'gModules/first_subscription/state_machine.js'

export default class FirstSubscription extends Component {
  displayName: 'SubscriptionIframe'

  static propTypes = {
    flowStage: PropTypes.oneOf(subStages)
  }

  render() {
    const isUneccessary = (this.props.flowStage === 'UNECCESSARY')
    return (isUneccessary) ? this.renderAccountPortal() : this.renderFlow()
  }

  renderFlow() {
    const neededProps = [
      'planId',
      'iframeUrl',
      'iframeWebsiteName',
      'onPaymentCancel',
      'onPaymentSuccess'
    ]
    const {flowStage} = this.props
    const loadedProps = _.pick(this.props, neededProps)
    return (
      <div className='container-fluid full-width homePage'>
        {(flowStage === 'FORM_START') && <FirstSubscriptionFlowLoading/>}
        {(flowStage === 'FORM_SUCCESS') && <FirstSubscriptionFlowLoaded {...loadedProps}/>}
        {(flowStage === 'CANCELLED') && <FirstSubscriptionFlowCancelled/>}
        {(flowStage === 'SYNCHRONIZING') && <FirstSubscriptionFlowLoadedSynchronizing/>}
        {(flowStage === 'COMPLETE') && <FirstSubscriptionFlowLoadedComplete/>}
      </div>
    )
  }

  renderAccountPortal() {
    const neededProps = [
      'plan',
      'paymentAccountPortalUrl'
    ]
    return (
      <div className='container-fluid full-width homePage'>
        {'me?'}
        <FirstSubscriptionFlowUneccessary
          paymentAccountPortalUrl={this.props.paymentAccountPortalUrl}
        />
      </div>
    )
  }
}

export const FirstSubscriptionFlowLoaded = ({planId, iframeUrl, iframeWebsiteName, onPaymentCancel, onPaymentSuccess}) => (
  <div>
  <div> Get plan: {planId} </div>
  <a onClick={onPaymentCancel}> Cancel </a>
  <a onClick={onPaymentSuccess}> Pay Mo Money </a>
  </div>
)

export const FirstSubscriptionFlowLoading = () => ( <div> Loading... </div> )
export const FirstSubscriptionFlowCancelled = () => ( <div> Payment Cancelled.  Refresh to try again. </div> )
export const FirstSubscriptionFlowSynchronizing = () => ( <div> Synchronizing... </div> )
export const FirstSubscriptionFlowComplete = () => ( <div> Payment Complete. </div> )

export const FirstSubscriptionFlowUneccessary = (paymentAccountPortalUrl) => (
  <div> Please go to the portal to edit your subscriptions: #{paymentAccountPortalUrl} </div>
)
