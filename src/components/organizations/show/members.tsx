import _ from "lodash";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import * as e from "~/lib/engine/engine";

import { MemberAddForm } from "../shared/MemberAddForm/index";

const MembersIndexSubTab = ({
  members,
  invitations,
  admin_id,
  onChangeSubTab,
  onRemove,
  meIsAdmin,
}) => (
  <div className="row MembersIndexSubTab">
    <div className="col-sm-2">
      {meIsAdmin && (
        <div className="ui button large green" onClick={onChangeSubTab}>
          Add Members
        </div>
      )}
    </div>
    <div className={meIsAdmin ? "col-sm-10" : "col-sm-8"}>
      <div>
        <div className="members">
          {_.map(members, (m) => (
            <Member
              key={m.id}
              user={m}
              isAdmin={admin_id === m.id}
              onRemove={() => {
                onRemove(m);
              }}
              meIsAdmin={meIsAdmin}
            />
          ))}
          {meIsAdmin &&
            _.map(invitations, (i) => <Invitee key={i.id} email={i.email} />)}
        </div>
      </div>
    </div>
  </div>
);

const Invitee: React.FC<{ email: string }> = ({ email }) => (
  <div className="Member">
    <div className="row">
      <div className="col-xs-7">
        <div className="avatar">
          <Icon name="envelope" />
        </div>
        <div className="name">{email}</div>
      </div>
      <div className="col-xs-2 role"></div>
      <div className="col-xs-2 invitation-status">invited</div>
      <div className="col-xs-1"></div>
    </div>
  </div>
);

const Member: React.FC<{
  user: any;
  isAdmin: boolean;
  onRemove(): void;
  meIsAdmin: boolean;
}> = ({ user, isAdmin, onRemove, meIsAdmin }) => (
  <div className="Member">
    {meIsAdmin && (
      <div className="row">
        <div className="col-xs-7">
          <a href={e.user.url(user)}>
            <img className="avatar" src={user.picture} />
          </a>
          <a href={e.user.url(user)} className="name">
            {user.name}
          </a>
        </div>
        <div className="col-xs-2 role">{isAdmin ? "Admin" : "Editor"}</div>
        <div className="col-xs-2 invitation-status">joined</div>
        <div className="col-xs-1">
          {user.membershipId && !isAdmin && (
            <button
              className="ui circular button small remove"
              onClick={onRemove}
            >
              <i className="ion-md-close" />
            </button>
          )}
        </div>
      </div>
    )}
    {!meIsAdmin && (
      <div className="row">
        <div className="col-xs-10">
          <a href={e.user.url(user)}>
            <img className="avatar" src={user.picture} />
          </a>
          <a href={e.user.url(user)} className="name">
            {user.name}
          </a>
        </div>
      </div>
    )}
  </div>
);

const MembersAddSubTab: React.FC<{
  organizationId: number;
  onChangeSubTab(): void;
}> = ({ organizationId, onChangeSubTab }) => (
  <div className="row MembersAddSubTab">
    <div className="col-sm-2">
      <div className="ui button large " onClick={onChangeSubTab}>
        <Icon name="chevron-left" /> Member List
      </div>
    </div>
    <div className="col-sm-8">
      <h1>Invite New Members</h1>
      <p>
        Members have viewing & editing access to all organization models. <br />
        If you are on a plan, your pricing will be adjusted within 24 hours.
      </p>
      <MemberAddForm organizationId={organizationId} />
    </div>
  </div>
);

type Props = {
  organizationId: number;
  startOnIndexTab: boolean;
  members: any[];
  memberships: any[];
  invitations: any[];
  admin_id: string;
  onRemove(member: any): void;
  meIsAdmin: boolean;
};

export const MembersTab: React.FC<Props> = ({
  members,
  memberships,
  invitations,
  admin_id,
  onRemove,
  meIsAdmin,
  organizationId,
  startOnIndexTab,
}) => {
  const [indexTabOpen, setIndexTabOpen] = useState(startOnIndexTab);

  const unjoinedInvitees = invitations.filter(
    (i) => !_.some(memberships, (m) => m.invitation_id === i.id)
  );
  const onChangeSubTab = () => {
    setIndexTabOpen(!indexTabOpen);
  };

  return (
    <div className="MembersTab">
      {indexTabOpen ? (
        <MembersIndexSubTab
          {...{
            members,
            invitations: unjoinedInvitees,
            admin_id,
            onRemove,
            onChangeSubTab,
            meIsAdmin,
          }}
        />
      ) : (
        <MembersAddSubTab {...{ organizationId, onChangeSubTab }} />
      )}
    </div>
  );
};
