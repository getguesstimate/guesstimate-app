import React, {Component, PropTypes} from 'react'
import {subStages} from 'gModules/first_subscription/state_machine.js'

export default class FirstSubscription extends Component {
  displayName: 'SubscriptionIframe'

  static propTypes = {
    flowStage: PropTypes.oneOf(subStages).isRequired,
    planId: PropTypes.string.isRequired,
    iframeUrl: PropTypes.string.isRequired,
    iframeWebsiteName: PropTypes.string.isRequired,
    onPaymentCancel: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    paymentAccountPortalUrl: PropTypes.string.isRequired
  }

  _formSuccessProps() {
    const neededProps = [
      'iframeUrl',
      'iframeWebsiteName',
      'onPaymentCancel',
      'onPaymentSuccess'
    ]
    return _.pick(this.props, neededProps)
  }

  _unnecessaryProps() {
    const neededProps = [
      'paymentAccountPortalUrl'
    ]
    return _.pick(this.props, neededProps)
  }

  render() {
    const {flowStage} = this.props
    return (
      <div className='container-fluid full-width homePage'>
        {(flowStage === 'UNNECESSARY') && <Unnecessary {...this._unnecessaryProps()}/>}
        {(flowStage === 'CANCELLED') && <Cancelled/>}
        {(flowStage === 'START') && <FormStart/>}
        {(flowStage === 'FORM_START') && <FormStart/>}
        {(flowStage === 'FORM_FAILURE') && <FormFailure/>}
        {(flowStage === 'FORM_SUCCESS') && <FormSuccess {...this._formSuccessProps()} />}
        {(flowStage === 'SYNCHRONIZATION_START') && <SynchronizationStart/>}
        {(flowStage === 'SYNCHRONIZATION_SUCCESS') && <SynchronizationSuccess/>}
        {(flowStage === 'SYNCHRONIZATION_FAILURE') && <SynchronizationFailure/>}
      </div>
    )
  }
}

export const FormSuccess = ({planId, iframeUrl, iframeWebsiteName, onPaymentCancel, onPaymentSuccess}) => (
  <div>
  <div> Get plan: {planId} </div>
  <a onClick={onPaymentCancel} className='ui button red'> Cancel </a>
  <a onClick={onPaymentSuccess} className='ui button blue'> Pay Mo Money </a>
  </div>
)

export const Unnecessary = ({paymentAccountPortalUrl}) => (
  <div> Please go to the portal to edit your subscriptions
    <a href={paymentAccountPortalUrl} className='ui button blue'> Portal </a>
  </div>
)

export const Cancelled = () => ( <div> Payment Cancelled.  Refresh to try again. </div> )
export const FormStart = () => ( <div> Loading... </div> )
export const FormFailure = () => ( <div> The form failed loading.  Try again soon. </div> )
export const SynchronizationStart = () => ( <div> Synchronizing... </div> )
export const SynchronizationSuccess = () => ( <div> Payment Complete. </div> )
export const SynchronizationFailure = () => ( <div> Synchronization Failed.  You have paid.  Contact Ozzie if there are issues with this. </div> )
