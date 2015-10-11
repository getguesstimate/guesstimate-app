import _ from 'lodash'

export default function me(state = {}, action) {
  switch (action.type) {
  case 'CREATE_ME':
    return _.cloneDeep(action.object)
  case 'DESTROY_ME':
    return {}
  default:
    return state
  }
}

