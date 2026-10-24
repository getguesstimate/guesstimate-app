import { useState } from "react";
import { CollectionAvatar } from "~/components/collections/ModelCollection";
import { Icon } from "~/components/workspace/Icon";
import { FieldHelp } from "~/components/workspace/FieldHelp";
import { MemberAddForm } from "../shared/MemberAddForm";
import styles from "../../collections/collections.module.css";
import account from "../../account/account.module.css";

type Props = {
  organizationId: number;
  startOnIndexTab: boolean;
  members: any[];
  memberships: any[];
  invitations: any[];
  admin_id: string | number;
  onRemove(member: any): void;
  meIsAdmin: boolean;
};
export function MembersTab({
  organizationId,
  startOnIndexTab,
  members,
  memberships,
  invitations,
  admin_id,
  onRemove,
  meIsAdmin,
}: Props) {
  const [adding, setAdding] = useState(!startOnIndexTab);
  const pending = invitations.filter(
    (invitation) =>
      !memberships.some(
        (membership) => membership.invitation_id === invitation.id
      )
  );
  return (
    <section>
      <div className={styles.memberToolbar}>
        <h2>{adding ? "Invite members" : `Members · ${members.length}`}</h2>
        {meIsAdmin && (
          <button
            className={account.secondary}
            onClick={() => setAdding((value) => !value)}
          >
            {adding ? "Back to members" : "Invite members"}
          </button>
        )}
      </div>
      {adding && meIsAdmin ? (
        <div className={`${account.card} ${account.organizationCard}`}>
          <div className={account.cardHeading}>
            <h2>Add someone to your team</h2>
            <FieldHelp label="About member access">
              <p>
                Members can view and edit the organization’s models. For a paid
                organization, adding members affects your bill.
              </p>
            </FieldHelp>
          </div>
          <MemberAddForm organizationId={organizationId} />
        </div>
      ) : (
        <div className={styles.memberList}>
          {members.map((member) => (
            <div className={styles.memberRow} key={member.id}>
              <CollectionAvatar name={member.name} picture={member.picture} />
              <a className={styles.memberName} href={`/users/${member.id}`}>
                {member.name || "Member"}
              </a>
              <span className={styles.memberRole}>
                {String(member.id) === String(admin_id) ? "Admin" : "Member"}
              </span>
              {meIsAdmin &&
                member.membershipId &&
                String(member.id) !== String(admin_id) && (
                  <button
                    className={styles.removeMember}
                    aria-label={`Remove ${member.name || "member"}`}
                    onClick={() => onRemove(member)}
                  >
                    <Icon name="close" />
                  </button>
                )}
            </div>
          ))}
          {meIsAdmin &&
            pending.map((invitation) => (
              <div className={styles.memberRow} key={invitation.id}>
                <Icon name="mail" />
                <span className={styles.memberName}>{invitation.email}</span>
                <span className={styles.memberRole}>Invited</span>
              </div>
            ))}
          {!members.length && (
            <p className={account.muted}>No members to show.</p>
          )}
        </div>
      )}
    </section>
  );
}
