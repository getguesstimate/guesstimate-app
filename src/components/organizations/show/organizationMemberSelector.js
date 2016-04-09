import { createSelector } from 'reselect';
import e from 'gEngine/engine'

const userOrganizationMembershipSelector = state => state.userOrganizationMemberships
const userSelector = state => state.users
const organizationIdSelector = (state, props) => props.organizationId

export const organizationMemberSelector = createSelector(
  userOrganizationMembershipSelector,
  userSelector,
  organizationIdSelector,
  (memberships, users, organizationId) => {
    return {
      members: e.organization.organizationUsers(organizationId, users, memberships)
    }
  }
);


