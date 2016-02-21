import {requestReducer, initialRequestState, singleEntity} from '../helpers.js'
import { combineReducers } from 'redux'

const initialState = {
  iframe: {
    url: null,
    website_name: null,
    request: initialRequestState
  },

  portal: {
    url: null,
    request: initialRequestState
  }
}

function iframe(state = initialState.iframe, action = null) {
  switch (action.type) {
    case 'SUBSCRIPTION_IFRAME_FETCH_START':
      return singleEntity(state, action, 'START', ['url', 'website_name'])
    case 'SUBSCRIPTION_IFRAME_FETCH_SUCCESS':
      return singleEntity(state, action, 'SUCCESS', ['url', 'website_name'])
    case 'SUBSCRIPTION_IFRAME_FETCH_FAILURE':
      return singleEntity(state, action, 'FAILURE', ['url', 'website_name'])
    default:
      return state
  }
}

function portal(state = initialState.portal, action = null){
  switch (action.type) {
    case 'SUBSCRIPTION_PORTAL_FETCH_START':
      return singleEntity(state, action, 'START', ['url'])
    case 'SUBSCRIPTION_PORTAL_FETCH_SUCCESS':
      return singleEntity(state, action, 'SUCCESS', ['url'])
    case 'SUBSCRIPTION_PORTAL_FETCH_FAILURE':
      return singleEntity(state, action, 'FAILURE', ['url'])
    default:
      return state
  }
}

export default combineReducers({
  iframe,
  portal
})
