import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";

import { httpRequestSelector } from "./httpRequestSelector";

import { Button } from "~/components/utility/buttons/button";
import { Input } from "~/components/utility/forms";
import { Message } from "~/components/utility/Message";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as userOrganizationMembershipActions from "~/modules/userOrganizationMemberships/actions";

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
    if (e.key === "Enter" && validateEmail(email)) {
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
      <div>
        <div className="mb-4 flex max-w-3xl flex-col gap-1">
          <label className="text-sm font-bold">Email Address</label>
          <Input
            value={value}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="name@domain.com"
            theme="padded"
            ref={input}
            onChange={onChange}
          />
        </div>
        <Button size="padded" color="blue" disabled={!isValid} onClick={submit}>
          Invite User
        </Button>
      </div>
      <div className="mt-8 space-y-2">
        {requests.map((request) => (
          <InvitationHttpRequest
            key={request.id}
            busy={request.busy}
            success={request.success}
            email={request.email}
            isExistingMember={request.isExistingMember}
          />
        ))}
      </div>
    </div>
  );
};

const InvitationHttpRequest: React.FC<{
  busy: boolean;
  success: boolean;
  email: string;
  isExistingMember: boolean;
}> = ({ busy, success, email, isExistingMember }) => {
  if (busy) {
    return <Message>Sending...</Message>;
  } else if (!success) {
    return (
      <Message theme="error">
        Invitation to {email} failed. This could be because they are already
        part of the organization or because of a server problem. If it
        continues, please let us know.
      </Message>
    );
  } else if (isExistingMember) {
    return (
      <Message theme="success">{email} was added to your organization.</Message>
    );
  } else {
    return (
      <Message theme="success">
        {email} was sent an email invitation to join your organization.
      </Message>
    );
  }
};
