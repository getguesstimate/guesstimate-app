import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { httpRequestSelector } from "./httpRequestSelector";

import * as userOrganizationMembershipActions from "gModules/userOrganizationMemberships/actions";

function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

@connect(httpRequestSelector)
export class MemberAddForm extends Component {
  state = { value: "" };

  componentDidMount() {
    this.refs.input && this.refs.input.focus();
  }

  _email() {
    return this.state.value.trim();
  }
  _onChange(e) {
    this.setState({ value: e.target.value });
  }
  _onKeyDown(e) {
    if (e.keyCode === 13 && validateEmail(this._email())) {
      this._submit();
    }
  }

  _submit() {
    this.props.dispatch(
      userOrganizationMembershipActions.createWithEmail(
        this.props.organizationId,
        this._email()
      )
    );
    this.setState({ value: "" });
  }

  render() {
    const { value } = this.state;
    const isValid = validateEmail(this._email());
    const isEmpty = _.isEmpty(value);
    const buttonColor = isValid || isEmpty ? "green" : "blue";

    const requests = _.orderBy(
      _.cloneDeep(this.props.httpRequests),
      ["created_at"],
      ["desc"]
    );
    return (
      <div className="MemberAddForm">
        <div className="ui form">
          <div className="field">
            <label>Email Address</label>
            <input
              value={this.state.value}
              onKeyDown={this._onKeyDown.bind(this)}
              type="text"
              placeholder="name@domain.com"
              ref="input"
              onChange={this._onChange.bind(this)}
            />
          </div>
          <div
            className={`ui button primary ${buttonColor} ${
              isValid ? "" : "disabled"
            }`}
            onClick={this._submit.bind(this)}
          >
            Invite User
          </div>
        </div>
        {_.map(requests, (request) => {
          return (
            <InvitationHttpRequest
              key={request.id}
              busy={request.busy}
              success={request.success}
              email={request.email}
              isExistingMember={request.isExistingMember}
            />
          );
        })}
      </div>
    );
  }
}

const InvitationHttpRequest = ({ busy, success, email, isExistingMember }) => {
  let status = httpStatus(busy, success);

  if (status === "sending") {
    return (
      <div className="InvitationHttpRequest ui ignored message">Sending...</div>
    );
  } else if (status === "failure") {
    return (
      <div className="InvitationHttpRequest ui error message">
        Invitation to {email} failed. This could be because they are already
        part of the organization or because of a server problem. If it
        continues, please let us know.
      </div>
    );
  } else if (isExistingMember) {
    return (
      <div className="InvitationHttpRequest ui success message">
        {email} was added to your organization.
      </div>
    );
  } else {
    return (
      <div className="InvitationHttpRequest ui success message">
        {email} was sent an email invitation to join your organization.
      </div>
    );
  }
};

function httpStatus(busy, success) {
  if (busy) {
    return "sending";
  } else if (success) {
    return "success";
  } else {
    return "failure";
  }
}
