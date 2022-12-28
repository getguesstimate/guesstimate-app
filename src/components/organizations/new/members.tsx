import React from "react";
import { MemberAddForm } from "../shared/MemberAddForm/index";

import { organization } from "gEngine/engine";

export const LocalAddMembers: React.FC<{ organizationId: string }> = ({
  organizationId,
}) => (
  <div className="row">
    <div className="col-sm-7">
      <MemberAddForm organizationId={organizationId} />
      <br />
      <br />
      <a
        className="ui button green"
        href={organization.url({ id: organizationId })}
      >
        Finish Registration{" "}
      </a>
    </div>
    <div className="col-sm-1" />
    <div className="col-sm-4">
      <div className="ui message">
        <h3> Organization Members </h3>
        <p>
          Organization members will be able to see and edit all organization
          models.
        </p>
        <p>
          As an organization admin, you will be able to invite, add, and remove
          members in the future.
        </p>
      </div>
    </div>
  </div>
);
