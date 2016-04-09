import * as _userOrganizationMemberships from './userOrganizationMemberships'

export function url (organization) {
  return (!!organization) ? ('/organizations/' + organization.id) : ''
}

export function organizationUsers(organizationId, users, memberships) {
  return _.filter(users, u => _userOrganizationMemberships.isMember(organizationId, u.id, memberships))
}
