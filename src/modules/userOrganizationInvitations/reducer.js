import reduxCrud  from 'redux-crud'
import SI from 'seamless-immutable'

const standardReducers = reduxCrud.reducersFor('userOrganizationInvitations')

export function userOrganizationInvitationsR(state, memberships, action) {
  switch(action.type) {
    case 'USER_ORGANIZATION_MEMBERSHIPS_DELETE_SUCCESS': {
      const membership =  memberships.find(e => (e.id === action.record.id))
      return state.filter(e => e.id !== _.get(membership, 'invitation_id'))
    }
    default:
      return standardReducers(state, action)
  }
}

