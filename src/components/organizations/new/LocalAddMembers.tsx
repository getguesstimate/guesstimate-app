import React from "react";
import { MemberAddForm } from "../shared/MemberAddForm/index";

import { organization } from "~/lib/engine/engine";
import { Message } from "./Message";

export const LocalAddMembers: React.FC<{ organizationId: number }> = ({
  organizationId,
}) => (
  <div className="grid grid-cols-12">
    <div className="col-span-7">
      <MemberAddForm organizationId={organizationId} />
      <br />
      <br />
      <a
        className="ui button green"
        href={organization.url({ id: organizationId })}
      >
        Finish Registration
      </a>
    </div>
    <div className="col-span-4 col-start-9">
      <Message title="Organization Members">
        <p>
          Organization members will be able to see and edit all organization
          models.
        </p>
        <p>
          As an organization admin, you will be able to invite, add, and remove
          members in the future.
        </p>
      </Message>
    </div>
  </div>
);
