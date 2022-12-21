import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import FirstSubscriptionContainer from "gComponents/subscriptions/FirstSubscription/container.js";
import Container from "gComponents/utility/container/Container.js";
import Plan from "lib/config/plan.js";

import "./style.css";

function mapStateToProps(state) {
  return {
    me: state.me,
  };
}

@connect(mapStateToProps)
export default class FirstSubscriptionPage extends Component {
  static propTypes = {
    planName: PropTypes.oneOf(["lite", "premium"]),
  };

  render() {
    const { me, planName } = this.props;
    const planId = { lite: "personal_lite", premium: "personal_premium" }[
      planName
    ];
    const plan = Plan.find(planId);
    return (
      <Container>
        <div className="FirstSubscriptionPage">
          <div className="row">
            <div className="col-sm-5 col-sm-offset-1">
              <div className="FirstSubscriptionPage-header">
                <h1>
                  {" "}
                  {`The ${this.props.planName.capitalizeFirstLetter()} Plan`}
                </h1>
                <h2>
                  {" "}
                  <span className="number"> {plan.number()} </span> private
                  models{" "}
                </h2>
              </div>
              <div className="FirstSubscriptionPage-sidebar">
                <h3> Privacy </h3>
                <p>
                  {" "}
                  We will not sell or distribute your contact information. Read
                  our Privacy Policy.
                </p>

                <h3> Cancellations </h3>
                <p> You cancel at any time with our payment portal. </p>
              </div>
            </div>
            <div className="col-sm-5">
              {!!me.id && planId && (
                <FirstSubscriptionContainer planId={planId} />
              )}
              {!!me.id && !planId && <h2> Plan Invalid </h2>}
              {!me.id && <h2> Log in to view this page </h2>}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
