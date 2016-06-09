import reduxCrud  from 'redux-crud'
import SI from 'seamless-immutable'

const standardReducers = reduxCrud.reducersFor('users')

export function usersR(state, action) {
  switch(action.type) {
    case 'USER_ORGANIZATION_MEMBERSHIPS_FETCH_SUCCESS': {
      const users = _.get(action, 'users.organizations')
      if (!users || users.length === 0) { return state }

      const updatedUsers = users.map(u => ({...state.find(s => s.id === u.id), ...u}))
      return SI([...state.filter(s => !_.some(users, o => s.id === u.id)), ...updatedUsers])
    }
    default:
      return standardReducers(state, action)
  }
}

