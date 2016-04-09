import * as _userOrganizationMemberships from './userOrganizationMemberships'

export function usersOrganizations(user, memberships, organizations) {
  return _.filter(organizations, o => _userOrganizationMemberships.isMember(o.id, user.id, memberships))
}

export function url (user) {
  return (!!user) ? urlById(user.id) : ''
}

export function urlById (id) {
  return '/users/' + id
}
