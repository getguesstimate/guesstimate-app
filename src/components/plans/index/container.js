import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import { PlanIndex } from "./PlanIndex";

import * as e from "gEngine/engine";

function mapStateToProps(state) {
  return {
    me: state.me,
  };
}

class PlanIndexContainer extends Component {
  _onChoose(planId) {
    const plan = { personal_lite: "lite", personal_premium: "premium" }[planId];
    this.props.router.push(`subscribe/${plan}`);
  }

  _onNewOrganizationNavigation() {
    this.props.router.push(`organizations/new`);
  }

  render() {
    const { me } = this.props;
    const portalUrl = _.get(me, "profile.account._links.payment_portal.href");
    const userPlanId = _.get(me, "profile.plan.id");
    const isLoggedIn = e.me.isLoggedIn(me);

    const props = {
      portalUrl,
      userPlanId,
      isLoggedIn,
      onChoose: this._onChoose.bind(this),
      onNewOrganizationNavigation: this._onNewOrganizationNavigation.bind(this),
    };

    return <PlanIndex {...props} />;
  }
}

export default connect(mapStateToProps)(withRouter(PlanIndexContainer));
