import * as _userOrganizationMemberships from './userOrganizationMemberships'

function sameId(first, second) {
  return (parseInt(first) === parseInt(second))
}

export function url(organization) {
  return (!!organization) ? urlById(organization.id) : ''
}

export function urlById(id) {
  return '/organizations/' + id
}

export function organizationUsers(organizationId, users, memberships) {
  let filteredMemberships = organizationMemberships(organizationId, memberships)
  let filteredUsers = _.filter(users, u => _userOrganizationMemberships.isMember(organizationId, u.id, filteredMemberships))
  return filteredUsers.map(e => {
    let membership = filteredMemberships.find(m => sameId(m.user_id, e.id))
    return {...e, membershipId: (membership && membership.id)}
  })
}

export function organizationMemberships(organizationId, memberships) {
  return _.filter(memberships, e => sameId(e.organization_id, organizationId))
}

export function organizationInvitations(organizationId, invitations) {
  return _.filter(invitations, e => sameId(e.organization_id, organizationId))
}
