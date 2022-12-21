import React, { Component } from "react";
import { connect } from "react-redux";

import Card, { CardListElement } from "gComponents/utility/card/index";

import { create } from "gModules/organizations/actions";

export const PlanElement = ({ onClick, isSelected, children }) => (
  <div className={`PlanElement ${isSelected && "selected"}`} onClick={onClick}>
    <div className="radio-section">
      <input type="radio" checked={isSelected} readOnly={true} />
    </div>
    <div className="content-section">{children}</div>
  </div>
);

export const PlanList = ({ onSelect, plan }) => (
  <div className="PlanList">
    <PlanElement
      onClick={() => {
        onSelect("FREE");
      }}
      isSelected={plan === "FREE"}
    >
      Unlimited members and public models for free.
    </PlanElement>
    <PlanElement
      onClick={() => {
        onSelect("PREMIUM");
      }}
      isSelected={plan === "PREMIUM"}
    >
      Unlimited private models. $12/month per user.
      <div className="free-trial">
        Free 30-day trial, no credit card needed.
      </div>
    </PlanElement>
  </div>
);

@connect()
export class CreateOrganizationForm extends Component {
  state = {
    value: "",
    plan: "PREMIUM",
    hasClicked: false,
  };

  _onSubmit() {
    if (this.state.hasClicked) {
      return;
    }
    const newOrganization = {
      name: this.state.value,
      plan: this.state.plan === "PREMIUM" ? 6 : 5,
    };
    this.props.dispatch(create(newOrganization));
    this.setState({ hasClicked: true });
  }

  render() {
    const { value, plan, hasClicked } = this.state;
    const canSubmit = _.isEmpty(this.state.value) && !hasClicked;
    return (
      <div className="row">
        <div className="col-sm-7">
          <div className="ui form">
            <div className="field name">
              <label>Organization Name</label>
              <input
                placeholder={"name"}
                value={value}
                onChange={(e) => {
                  this.setState({ value: e.target.value });
                }}
              />
            </div>

            <div className="field plan">
              <label>Plan</label>
              <PlanList
                plan={plan}
                onSelect={(plan) => {
                  this.setState({ plan });
                }}
              />
            </div>
            <div
              className={`ui button submit ${canSubmit ? "disabled" : "green"}`}
              onClick={this._onSubmit.bind(this)}
            >
              Create Organization
            </div>
          </div>
        </div>

        <div className="col-sm-1" />
        <div className="col-sm-4">
          <div className="ui message">
            <h3> Organizations </h3>
            <p>Share & collaborate on models with a group you trust.</p>
          </div>
        </div>
      </div>
    );
  }
}
