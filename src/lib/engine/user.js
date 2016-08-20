import * as _userOrganizationMemberships from './userOrganizationMemberships'

export const url = u => (!!_.get(u, 'id')) ? urlById(u.id) : ''
export const urlById = id => `/users/${id}`

export function usersOrganizations(user, memberships, organizations) {
  return _.filter(organizations, o => _userOrganizationMemberships.isMember(o.id, user.id, memberships))
}
