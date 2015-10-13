import _ from 'lodash'

export default function me(state = {}, action) {
  switch (action.type) {
  case 'CREATE_ME':
    let newMe = _.cloneDeep(action.object)
    newMe.id = _.get(newMe, 'profile.user_metadata.guesstimateId')
    return newMe
  case 'DESTROY_ME':
    return {}
  default:
    return state
  }
}

