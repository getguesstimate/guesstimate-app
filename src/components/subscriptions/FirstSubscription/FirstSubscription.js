import React, {Component, PropTypes} from 'react'
import {subStages} from 'gModules/first_subscription/state_machine.js'
import NewOrder from './NewOrder.js'

export default class FirstSubscription extends Component {
  displayName: 'SubscriptionIframe'

  static propTypes = {
    flowStage: PropTypes.oneOf(subStages).isRequired,
    planId: PropTypes.string.isRequired,
    iframeUrl: PropTypes.string,
    iframeWebsiteName: PropTypes.string,
    onPaymentCancel: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    paymentAccountPortalUrl: PropTypes.string,
  }

  static defaultProps = {
    iframeUrl: '',
    iframeWebsiteName: '',
    paymentAccountPortalUrl: '',
    isTest: true
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
    const {flowStage, isTest} = this.props
    return (
      <div className='container-fluid full-width homePage'>
        {(flowStage === 'UNNECESSARY') && <Unnecessary {...this._unnecessaryProps()}/>}
        {(flowStage === 'CANCELLED') && <Cancelled/>}
        {(flowStage === 'START') && <FormStart/>}
        {(flowStage === 'FORM_START') && <FormStart/>}
        {(flowStage === 'FORM_FAILURE') && <FormFailure/>}
        {(flowStage === 'FORM_SUCCESS' && !isTest) && <FormSuccess {...this._formSuccessProps()} />}
        {(flowStage === 'FORM_SUCCESS' && isTest) && <TestFormSuccess {...this._formSuccessProps()} />}
        {(flowStage === 'SYNCHRONIZATION_START') && <SynchronizationStart/>}
        {(flowStage === 'SYNCHRONIZATION_SUCCESS') && <SynchronizationSuccess/>}
        {(flowStage === 'SYNCHRONIZATION_FAILURE') && <SynchronizationFailure/>}
      </div>
    )
  }
}

export const TestFormSuccess = ({iframeUrl, iframeWebsiteName, onPaymentCancel, onPaymentSuccess}) => (
  <div>
    <h1>{`This is a test.`} </h1>
    <h2>{` Pretend strongly that there is a payment iframe here`}</h2>
    <h3>{`iframeUrl: ${iframeUrl}`} </h3>
    <h3>{`iframeWebsiteName: ${iframeWebsiteName}`} </h3>
    <a className='ui button red' onClick={onPaymentCancel}> {'Pretend to Cancel'} </a>
    <a className='ui button blue' onClick={onPaymentSuccess}> {'Pretend to Pay'} </a>
  </div>
)

export const FormSuccess = ({iframeUrl, iframeWebsiteName, onPaymentCancel, onPaymentSuccess}) => (
  <div>
    <NewOrder page={iframeUrl}
      name={iframeWebsiteName}
      onSuccess={onPaymentSuccess}
      onCancel={onPaymentCancel}
    />
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
