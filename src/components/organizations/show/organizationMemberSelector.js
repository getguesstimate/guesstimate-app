import { createSelector } from 'reselect';
import e from 'gEngine/engine'

const userOrganizationMembershipSelector = state => state.userOrganizationMemberships
const userOrganizationInvitationSelector = state => state.userOrganizationInvitations
const userSelector = state => state.users
const organizationIdSelector = (state, props) => props.organizationId

export const organizationMemberSelector = createSelector(
  userOrganizationMembershipSelector,
  userOrganizationInvitationSelector,
  userSelector,
  organizationIdSelector,
  (memberships, invitations, users, organizationId) => {
    return {
      members: e.organization.organizationUsers(organizationId, users, memberships),
      memberships: e.organization.organizationMemberships(organizationId, memberships),
      invitations: e.organization.organizationInvitations(organizationId, invitations),
    }
  }
);


