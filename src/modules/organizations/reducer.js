import reduxCrud  from 'redux-crud'

const standardReducers = reduxCrud.reducersFor('organizations')

export function organizationsR(state, action) {
  console.log(action.type)
  switch(action.type) {
    case 'USER_ORGANIZATION_MEMBERSHIPS_FETCH_SUCCESS': {
      if (_.has(action, 'data.organizations')) {
        const updatedOrgs = action.data.organizations.map(o => ({...state.find(s => s.id === o.id), ...o}))
        return [...state.filter(s => !_.some(action.data.organizations, o => s.id === o.id)), ...updatedOrgs]
      }
      return state
    }
    default:
      return standardReducers(state, action)
  }
}
