import * as _userOrganizationMemberships from './userOrganizationMemberships'
import * as _collections from './collections'
import {orArr} from './utils'

export const url = o => !!_.get(o, 'id') ? urlById(o.id) : ''
export const image = o => _.isEmpty(_.get(o, 'picture')) ? '/organization-default-image.png' : o.picture
export const urlById = id => `/organizations/${id}`
export const hasPrivateAccess = organization => _.get(organization, 'plan.private_model_limit') !== 0
export const canMakeMorePrivateModels = hasPrivateAccess
export const organizationMemberships = (id, memberships) => _collections.filter(memberships, id, 'organization_id')
export const organizationInvitations = (id, invitations) => _collections.filter(invitations, id, 'organization_id')

const ORG_FACT_READABLE_ID_PREFIX = 'organization_'
export const organizationReadableId = o => !!o ? `${ORG_FACT_READABLE_ID_PREFIX}${o.id}` : ''
export const organizationIdFromFactReadableId = str => str.slice(ORG_FACT_READABLE_ID_PREFIX.length)

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
  return orArr(_collections.gget(organizationFacts, readableId, 'variable_name', 'children'))
}
