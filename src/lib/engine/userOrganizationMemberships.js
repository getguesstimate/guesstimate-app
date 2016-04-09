export function isMember(organization_id, user_id, memberships) {
  return _.some(memberships, m => (parseInt(m.organization_id) === parseInt(organization_id) && parseInt(m.user_id) === parseInt(user_id)))
}
