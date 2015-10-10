export default function me(state = {}, action) {
  switch (action.type) {
  case 'CREATE_ME':
    return action.object
  case 'DESTROY_ME':
    return {}
  default:
    return state
  }
}

