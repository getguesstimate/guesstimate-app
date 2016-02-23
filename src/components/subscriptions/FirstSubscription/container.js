import React, {Component, PropTypes} from 'react'
import * as firstSubscriptionActions from 'gModules/first_subscription/actions.js'
import {connect} from 'react-redux'

function mapStateToProps(state) {
  return {
    me: state.me,
    firstSubscription: state.firstSubscription
  }
}

@connect(mapStateToProps)
export default class FirstSubscriptionContainer extends Component {
  displayName: 'FirstSubscriptionContainer'

  componentWillMount() {
    firstSubscriptionActions.flowStageReset()

    if !this._paymentAccountExists() {
      this.props.dispatch(firstSubscriptionActions.fetchIframe({
        user_id: this.props.me.id,
        plan_id: this.props.plan
      }))
    }
  }

  _onPaymentSuccess() { this.props.dispatch(firstSubscriptionActions.flowStagePaymentSuccess()) }
  _onPaymentCancel() { this.props.dispatch(firstSubscriptionActions.flowStageCancel()) }

  _paymentAccountPortalUrl() { return _.get(this.props.me, 'profile.account._links.account') }
  _paymentAccountExists() { return !!_.get(this.props.me, 'profile.has_payment_account') }

  _iframeUrl() { return this.props.firstSubscription.iframe.href }
  _iframeWebsiteName() { return this.props.firstSubscription.iframe.website_name }

  _findFlowStage() {
    const {website_name, href, request: {waiting}} = this.props.firstSubscription.iframe
    const {flowStage} = this.props.firstSubscription

    if (this._paymentAccountExists()) {
      return 'UNECCESSARY'
    } if (flowStage === 'BEGIN') {
      return (waiting) ? 'LOADING' : 'LOADED'
    } else {
      return flowStage
    }
  }

  render() {
    return (
      <FirstSubscription
        plan={this.props.plan}
        flowStage={this._findFlowStage()}
        paymentAccountPortalUrl={this._paymentAccountPortalUrl()}
        iframeUrl={this._iframeUrl()}
        iframeWebsiteName={this._iframeUrl()}
        onPaymentSuccess={this._onPaymentSuccess.bind(this)}
        onPaymentCancel={this._onPaymentCancel.bind(this)}
      />
    )
  }
}
