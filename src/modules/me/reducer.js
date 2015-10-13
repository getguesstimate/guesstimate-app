import _ from 'lodash'

let newState = null

export default function me(state = {}, action) {
  switch (action.type) {
  case 'AUTH0_ME_LOADED':
    return {
      token: action.token,
      profile: action.profile,
      loading: true
    }
  case 'GUESSTIMATE_ME_LOADED':
    newState = {
      token: state.token,
      id: action.id,
      profile: action.profile,
      loading: false
    }
    return newState
  case 'DESTROY_ME':
    return {}
  default:
    return state
  }
}

