import _ from "lodash";
import React, { Component, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import { httpRequestSelector } from "./httpRequestSelector";

import * as userOrganizationMembershipActions from "gModules/userOrganizationMemberships/actions";
import { useAppDispatch, useAppSelector } from "gModules/hooks";

function validateEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const MemberAddForm: React.FC<{ organizationId: string }> = ({
  organizationId,
}) => {
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { httpRequests } = useAppSelector((state) =>
    httpRequestSelector(state, organizationId)
  );

  useEffect(() => {
    input.current?.focus();
  }, []);

  const _email = () => {
    return value.trim();
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const _onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && validateEmail(_email())) {
      _submit();
    }
  };

  const _submit = () => {
    dispatch(
      userOrganizationMembershipActions.createWithEmail(
        organizationId,
        _email()
      )
    );
    setValue("");
  };

  const isValid = validateEmail(_email());
  const isEmpty = _.isEmpty(value);
  const buttonColor = isValid || isEmpty ? "green" : "blue";

  const requests = _.orderBy(
    _.cloneDeep(httpRequests),
    ["created_at"],
    ["desc"]
  );
  return (
    <div className="MemberAddForm">
      <div className="ui form">
        <div className="field">
          <label>Email Address</label>
          <input
            value={value}
            onKeyDown={_onKeyDown}
            type="text"
            placeholder="name@domain.com"
            ref={input}
            onChange={_onChange}
          />
        </div>
        <div
          className={`ui button primary ${buttonColor} ${
            isValid ? "" : "disabled"
          }`}
          onClick={_submit}
        >
          Invite User
        </div>
      </div>
      {requests.map((request) => {
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
};

const InvitationHttpRequest: React.FC<{
  busy: boolean;
  success: boolean;
  email: string;
  isExistingMember: boolean;
}> = ({ busy, success, email, isExistingMember }) => {
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

function httpStatus(busy: boolean, success: boolean) {
  if (busy) {
    return "sending";
  } else if (success) {
    return "success";
  } else {
    return "failure";
  }
}
