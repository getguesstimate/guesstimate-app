import clsx from "clsx";
import _ from "lodash";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import * as e from "~/lib/engine/engine";

import { MemberAddForm } from "../shared/MemberAddForm/index";

const Layout: React.FC<{
  children: [JSX.Element | null, JSX.Element];
}> = ({ children: [left, right] }) => (
  <div className="px-4 md:px-0 space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
    <div className="md:col-span-2">{left}</div>
    <div
      className={clsx("col-start-3", left ? "md:col-span-10" : "md:col-span-8")}
    >
      {right}
    </div>
  </div>
);

const MembersIndexSubTab: React.FC<{
  members: any[];
  invitations: any[];
  admin_id: string;
  onChangeSubTab(): void;
  onRemove(member: any): void;
  meIsAdmin: boolean;
}> = ({
  members,
  invitations,
  admin_id,
  onChangeSubTab,
  onRemove,
  meIsAdmin,
}) => (
  <Layout>
    {meIsAdmin ? (
      <div
        className="ui button large green !bg-green-2"
        onClick={onChangeSubTab}
      >
        Add Members
      </div>
    ) : null}
    <div>
      <div className="bg-white rounded px-6">
        {members.map((m) => (
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
          invitations.map((i) => <Invitee key={i.id} email={i.email} />)}
      </div>
    </div>
  </Layout>
);

const InvitationStatus: React.FC<{ status: string }> = ({ status }) => (
  <div className="text-lg text-grey-666">{status}</div>
);

const InviteeOrMemberBox: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="grid grid-cols-12 gap-4 items-center py-4 border-b border-grey-eee last:border-b-0">
    {children}
  </div>
);

const Invitee: React.FC<{ email: string }> = ({ email }) => (
  <InviteeOrMemberBox>
    <div className="col-span-7 flex items-center">
      <div className="text-blue-5/70 text-2xl w-10 mr-8 text-center">
        <Icon name="envelope" />
      </div>
      <div className="font-bold text-xl text-dark-3">{email}</div>
    </div>
    <div className="col-span-2 col-start-10">
      <InvitationStatus status="invited" />
    </div>
  </InviteeOrMemberBox>
);

const Member: React.FC<{
  user: any;
  isAdmin: boolean;
  onRemove(): void;
  meIsAdmin: boolean;
}> = ({ user, isAdmin, onRemove, meIsAdmin }) => (
  <InviteeOrMemberBox>
    <div className="col-span-7 flex items-center">
      <a href={e.user.url(user)}>
        <img className="w-10 h-10 rounded mr-8" src={user.picture} />
      </a>
      <a
        href={e.user.url(user)}
        className="font-bold text-xl text-dark-3 hover:text-black"
      >
        {user.name}
      </a>
    </div>

    {meIsAdmin && (
      <>
        <div className="col-span-2 text-lg font-bold text-grey-2">
          {isAdmin ? "Admin" : "Editor"}
        </div>
        <div className="col-span-2">
          <InvitationStatus status="joined" />
        </div>
        <div>
          {user.membershipId && !isAdmin && (
            <button
              className="p-1 w-8 h-8 rounded-full bg-grey-eee hover:bg-grey-ccc active:bg-grey-bbb"
              onClick={onRemove}
            >
              <i className="ion-md-close" />
            </button>
          )}
        </div>
      </>
    )}
  </InviteeOrMemberBox>
);

const MembersAddSubTab: React.FC<{
  organizationId: number;
  onChangeSubTab(): void;
}> = ({ organizationId, onChangeSubTab }) => (
  <Layout>
    <div>
      <div className="ui button large" onClick={onChangeSubTab}>
        <Icon name="chevron-left" /> Member List
      </div>
    </div>
    <div>
      <h1>Invite New Members</h1>
      <p className="text-grey-666 leading-6 mb-12">
        Members have viewing & editing access to all organization models. <br />
        If you are on a plan, your pricing will be adjusted within 24 hours.
      </p>
      <MemberAddForm organizationId={organizationId} />
    </div>
  </Layout>
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
    <div className="MembersTab mb-16">
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
