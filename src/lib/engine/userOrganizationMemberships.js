export function isMember(organization_id, user_id, memberships) {
  return _.some(memberships, m => (m.organization_id === organization_id && m.user_id === user_id))
}
