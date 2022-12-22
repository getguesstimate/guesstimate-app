import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import * as firstSubscriptionActions from "gModules/first_subscription/actions";
import { subStage } from "gModules/first_subscription/state_machine";
import * as spaceActions from "gModules/spaces/actions";

import FirstSubscription from "./FirstSubscription";

function mapStateToProps(state) {
  return {
    me: state.me,
    firstSubscription: state.firstSubscription,
  };
}

class FirstSubscriptionContainer extends Component {
  componentDidMount() {
    firstSubscriptionActions.flowStageReset();

    if (!this._paymentAccountExists()) {
      this.props.dispatch(
        firstSubscriptionActions.fetchIframe({
          user_id: this.props.me.id,
          plan_id: this.props.planId,
        })
      );
    }
  }

  _onPaymentSuccess() {
    this.props.dispatch(
      firstSubscriptionActions.postSynchronization({
        user_id: this.props.me.id,
      })
    );
  }

  _onPaymentCancel() {
    this.props.dispatch(firstSubscriptionActions.flowStageCancel());
  }

  _paymentAccountPortalUrl() {
    return _.get(this.props.me, "profile.account._links.account");
  }
  _paymentAccountExists() {
    return !!_.get(this.props.me, "profile.has_payment_account");
  }

  _iframeUrl() {
    return _.get(this.props.firstSubscription, "iframe.href") || "";
  }
  _iframeWebsiteName() {
    return _.get(this.props.firstSubscription, "iframe.website_name") || "";
  }
  _flowStage() {
    return subStage(this.props.firstSubscription);
  }

  _onNewModel() {
    this.props.dispatch(spaceActions.create(undefined, {}, this.props.router));
  }

  render() {
    return (
      <FirstSubscription
        planId={this.props.planId}
        flowStage={this._flowStage()}
        paymentAccountPortalUrl={this._paymentAccountPortalUrl()}
        iframeUrl={this._iframeUrl()}
        iframeWebsiteName={this._iframeWebsiteName()}
        onPaymentSuccess={this._onPaymentSuccess.bind(this)}
        onPaymentCancel={this._onPaymentCancel.bind(this)}
        onNewModel={this._onNewModel.bind(this)}
        isTest={false}
      />
    );
  }
}

export default connect(mapStateToProps)(withRouter(FirstSubscriptionContainer));
