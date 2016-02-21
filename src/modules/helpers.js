export const initialRequestState = {
  waiting: false,
  error: null
}

export function requestReducer(state, type, action = null) {
  switch (type) {
    case 'START':
      return {
        waiting: true,
        error: state.error
      }
    case 'SUCCESS':
      return {
        waiting: false,
        error: null
      }
    case 'FAILURE':
      return {
        waiting: false,
        error: 'error!'
      }
  default:
    return state
  }
}

export function singleEntity(state, action, type, keys) {
  newState = (type === 'SUCCESS') ? {state..., _.pick(action,keys)} : state,

  return {
    newState...,
    request: requestReducer(state.request, type, action)
  }
}
