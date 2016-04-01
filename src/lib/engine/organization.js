export function url (organization) {
  return (!!organization) ? ('/organizations/' + organization.id) : ''
}
