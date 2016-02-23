import React, {Component, PropTypes} from 'react'

export default class FirstSubscription extends Component {
  displayName: 'SubscriptionIframe'

  render() {
    const isUneccessary = (this.props.flowStage === 'UNECCESSARY')
    return (isUneccessary) ? this.renderAccountPortal() : this.renderFlow()
  }

  renderFlow() {
    {flowStage} = this.props

    const neededProps = [
      'plan',
      'iframeUrl',
      'iframeWebsiteName',
      'onPaymentCancel',
      'onPaymentSuccess'
    ]
    const loadedProps = _.pick(this.props, neededProps)

    return (
      <div className='container-fluid full-width homePage'>
        {flowStage === 'LOADING' && <FirstSubscriptionFlowLoading/>}
        {flowStage === 'LOADED' && <FirstSubscriptionFlowLoaded {...loadedProps}/>}
        {flowStage === 'CANCELLED' && <FirstSubscriptionFlowCancelled/>}
        {flowStage === 'SYNCHRONIZING' && <FirstSubscriptionFlowLoadedSynchronizing/>}
        {flowStage === 'COMPLETE' && <FirstSubscriptionFlowLoadedComplete/>}
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
        <FirstSubscriptionFlowUneccessary
          paymentAccountPortalUrl={this.props.paymentAccountPortalUrl}
        />
      </div>
    )
  }
}

export const FirstSubscriptionFlowLoading = () => ( <div> Loading... </div> )
export const FirstSubscriptionFlowCancelled = () => ( <div> Payment Cancelled.  Refresh to try again. </div> )
export const FirstSubscriptionFlowSynchronizing = () => ( <div> Synchronizing... </div> )
export const FirstSubscriptionFlowComplete = () => ( <div> Payment Complete. </div> )
export const FirstSubscriptionFlowLoaded = () => ( <div> Stuff is Loaded! </div> )

export const FirstSubscriptionFlowUneccessary = (paymentAccountPortalUrl) => (
  <div> Please go to the portal to edit your subscriptions: #{paymentAccountPortalUrl} </div>
)
