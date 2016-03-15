import React, {Component, PropTypes} from 'react'
import {subStages} from 'gModules/first_subscription/state_machine.js'
import NewOrder from './NewOrder.js'
import './style.css'

export const SynchronizationSuccess = () => (
  <Message>
    <i className='ion-ios-planet large-icon'/>
    <h2>You now have access to private models!</h2>
    <a className='ui button blue huge' href='/models/new'> {'Create A Private Model'} </a>
  </Message>
)

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
      <div className='FirstSubscription'>
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
  <Message>
    <h2> Go to your portal to edit your plan</h2>
    <a href={paymentAccountPortalUrl} className='ui button blue huge'> Portal </a>
  </Message>
)

export const Message = ({text, children}) => (
  <div className='GeneralMessage'>
    {text &&
      <h2> {text} </h2>
    }
    {children && children}
  </div>
)

export const Cancelled = () => (
  <Message>
    <h2>Payment Cancelled.</h2>
    <h3> Refresh to try again.</h3>
  </Message>
)

export const FormStart = () => ( <Message text='Loading...'/>)
export const FormFailure = () => ( <Message text='The form failed loading.  Try again soon.' />)
export const SynchronizationStart = () => ( <Message text='Synchronizing...'/>)

export const SynchronizationFailure = () => (
  <Message>
    <h2>Synchronization Failed.</h2>
    <h3>Try refreshing the browser.</h3>
  </Message>
)
