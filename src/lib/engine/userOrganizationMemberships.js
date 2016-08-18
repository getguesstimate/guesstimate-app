import {typeSafeEq} from './utils'

export const isMember = (organization_id, user_id, memberships) => (
  _.some(memberships, m => typeSafeEq(m.organization_id, organization_id) && typeSafeEq(m.user_id, user_id))
)
