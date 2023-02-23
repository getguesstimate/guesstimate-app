import clsx from "clsx";
import _ from "lodash";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import * as e from "~/lib/engine/engine";

import { MemberAddForm } from "../shared/MemberAddForm/index";

const Layout: React.FC<{
  children: [JSX.Element | null, JSX.Element];
}> = ({ children: [left, right] }) => (
  <div className="space-y-4 px-4 md:grid md:grid-cols-12 md:gap-4 md:space-y-0 md:px-0">
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
      <div className="rounded bg-white px-6">
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
  <div className="grid grid-cols-12 items-center gap-4 border-b border-grey-eee py-4 last:border-b-0">
    {children}
  </div>
);

const Invitee: React.FC<{ email: string }> = ({ email }) => (
  <InviteeOrMemberBox>
    <div className="col-span-7 flex items-center">
      <div className="mr-8 w-10 text-center text-2xl text-blue-5/70">
        <Icon name="envelope" />
      </div>
      <div className="text-xl font-bold text-dark-3">{email}</div>
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
        <img className="mr-8 h-10 w-10 rounded" src={user.picture} />
      </a>
      <a
        href={e.user.url(user)}
        className="text-xl font-bold text-dark-3 hover:text-black"
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
              className="h-8 w-8 rounded-full bg-grey-eee p-1 hover:bg-grey-ccc active:bg-grey-bbb"
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
      <header className="mb-4 text-3xl font-bold">Invite New Members</header>
      <p className="mb-12 leading-6 text-grey-666">
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
