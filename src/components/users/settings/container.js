import React, { Component } from "react";
import { connect } from "react-redux";

import * as meActions from "gModules/me/actions";
import Settings from "./Settings";

function mapStateToProps(state) {
  return {
    me: state.me,
  };
}

class SettingsContainer extends Component {
  _refreshMe() {
    this.props.dispatch(meActions.guesstimateMeLoad());
  }
  render() {
    const { me } = this.props;
    const portalUrl = _.get(me, "profile.account._links.payment_portal.href");
    const planId = _.get(me, "profile.plan.id");
    return (
      <Settings
        planId={planId}
        portalUrl={portalUrl}
        onClose={this.props.onClose}
        onRefresh={this._refreshMe.bind(this)}
      />
    );
  }
}

export default connect(mapStateToProps)(SettingsContainer);
