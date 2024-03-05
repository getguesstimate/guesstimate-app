import { createSelector } from "reselect";
import * as e from "~/lib/engine/engine";
import { RootState } from "~/modules/store";

const userOrganizationMembershipSelector = (state: RootState) =>
  state.userOrganizationMemberships;
const userOrganizationInvitationSelector = (state: RootState) =>
  state.userOrganizationInvitations;
const userSelector = (state: RootState) => state.users;
const organizationIdSelector = (state: RootState, organizationId) =>
  organizationId;

export const organizationMemberSelector = createSelector(
  userOrganizationMembershipSelector,
  userOrganizationInvitationSelector,
  userSelector,
  organizationIdSelector,
  (memberships, invitations, users, organizationId: number) => {
    return {
      members: e.organization.organizationUsers(
        organizationId,
        users,
        memberships
      ),
      memberships: e.organization.organizationMemberships(
        organizationId,
        memberships
      ),
      invitations: e.organization.organizationInvitations(
        organizationId,
        invitations
      ),
    };
  }
);
