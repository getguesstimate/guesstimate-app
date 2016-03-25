import * as _userOrganizationMemberships from './userOrganizationMemberships'

export function usersOrganizations(user, memberships, organizations) {
  return _.filter(organizations, o => _userOrganizationMemberships.isMember(o.id, user.id, memberships))
}
