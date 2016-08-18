import * as _userOrganizationMemberships from './userOrganizationMemberships'
import * as _collections from './collections'

export const url = ({id}) => !!id ? urlById(id) : ''
export const image = ({picture}) => _.isEmpty(picture) ? '/organization-default-image.png' : picture
export const urlById = id => `/organizations/${id}`
export const hasPrivateAccess = organization => _.get(organization, 'plan.private_model_limit') !== 0
export const canMakeMorePrivateModels = hasPrivateAccess
export const organizationMemberships = (id, memberships) => _collections.filter(memberships, id, 'organization_id')
export const organizationInvitations = (id, invitations) => _collections.filter(invitations, id, 'organization_id')
export const organizationReadableId = ({id}) => `organization_${id}`

export function organizationUsers(organizationId, users, memberships) {
  let filteredMemberships = organizationMemberships(organizationId, memberships)
  let filteredUsers = _.filter(users, u => _userOrganizationMemberships.isMember(organizationId, u.id, filteredMemberships))
  return filteredUsers.map(e => {
    const membership = _collections.get(filteredMemberships, e.id, 'user_id')
    return {...e, membershipId: _.get(membership, 'id')}
  })
}

export function findFacts(organizationId, organizationFacts) {
  const readableId = organizationReadableId({id: organizationId})
  const containingFact = _collections.get(organizationFacts, readableId, 'variable_name')
  return _.get(containingFact, 'children') || []
}
