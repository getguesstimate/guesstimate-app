import {requestReducer, initialRequestState, singleEntity} from '../request_reducer.js'

const initialState = {
  iframe: {
    url: null,
    website_name: null,
    request: initialRequestState
  }

  initPortal: {
    url: null,
    request: initialRequestState
  }
}

function iframe(state = initialState.iframe, action = null) {
  switch (action.type) {
    case 'SUBSCRIPTION_IFRAME/FETCH/START':
      return singleEntity(state, action, 'START', ['url', 'website_name'])
    case 'SUBSCRIPTION_IFRAME/FETCH/SUCCESS':
      return singleEntity(state, action, 'SUCCESS', ['url', 'website_name'])
    case 'SUBSCRIPTION_IFRAME/FETCH/FAILURE':
      return singleEntity(state, action, 'FAILURE', ['url', 'website_name'])
    default:
      return state
  }
}

function portal(state = initalState.portal, action = null) {
  switch (action.type) {
    case 'SUBSCRIPTION_PORTAL/FETCH/START':
      return singleEntity(state, action, 'START', ['url'])
    case 'SUBSCRIPTION_PORTAL/FETCH/SUCCESS':
      return singleEntity(state, action, 'SUCCESS', ['url'])
    case 'SUBSCRIPTION_PORTAL/FETCH/FAILURE':
      return singleEntity(state, action, 'FAILURE', ['url'])
    default:
      return state
  }
}

export default combineReducers({
  iframe,
  portal
})
