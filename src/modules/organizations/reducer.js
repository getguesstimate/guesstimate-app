import reduxCrud  from 'redux-crud'

const standardReducers = reduxCrud.reducersFor('organizations')

export function organizationsR(state, action) {
  switch(action.type) {
    case 'USER_ORGANIZATION_MEMBERSHIPS_FETCH_SUCCESS': {
      const organizations = _.get(action, 'data.organizations')
      if (!organizations || organizations.length === 0) { return state }

      const updatedOrgs = organizations.map(o => ({...state.find(s => s.id === o.id), ...o}))
      return [...state.filter(s => !_.some(organizations, o => s.id === o.id)), ...updatedOrgs]
    }
    default:
      return standardReducers(state, action)
  }
}
