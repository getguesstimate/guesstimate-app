import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";

import { httpRequestSelector } from "./httpRequestSelector";

import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as userOrganizationMembershipActions from "~/modules/userOrganizationMemberships/actions";
import clsx from "clsx";
import { Button } from "~/components/utility/buttons/button";

function validateEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const MemberAddForm: React.FC<{ organizationId: number }> = ({
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

  const email = value.trim();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && validateEmail(email)) {
      submit();
    }
  };

  const submit = () => {
    dispatch(
      userOrganizationMembershipActions.createWithEmail(organizationId, email)
    );
    setValue("");
  };

  const isValid = validateEmail(email);

  const requests = _.orderBy(
    _.cloneDeep(httpRequests),
    ["created_at"],
    ["desc"]
  );
  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Email Address</label>
          <input
            value={value}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="name@domain.com"
            className="max-w-3xl"
            ref={input}
            onChange={onChange}
          />
        </div>
        <Button size="large" color="green" disabled={!isValid} onClick={submit}>
          Invite User
        </Button>
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
    return <div className="ui ignored message">Sending...</div>;
  } else if (status === "failure") {
    return (
      <div className="ui error message">
        Invitation to {email} failed. This could be because they are already
        part of the organization or because of a server problem. If it
        continues, please let us know.
      </div>
    );
  } else if (isExistingMember) {
    return (
      <div className="ui success message">
        {email} was added to your organization.
      </div>
    );
  } else {
    return (
      <div className="ui success message">
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
