import {requestReducer, initialRequestState, singleEntity} from '../helpers.js'
import { combineReducers } from 'redux'
import { newFlowState } from './state_machine.js'

export const initialState = {
  flowStage: 'START',
  iframe: {
    href: null,
    website_name: null,
    request: initialRequestState
  },
  synchronization: {
    request: initialRequestState
  }
}

function flowStage(state = initialState.flowStage, action = {type: null}) {
  return newFlowState(state, _.get(action, 'type'))
}

function iframe(state = initialState.iframe, action = {type: null}) {
  switch (action.type) {
    case 'FIRST_SUBSCRIPTION_IFRAME_FETCH_START':
      return singleEntity(state, action, 'START', ['href', 'website_name'])
    case 'FIRST_SUBSCRIPTION_IFRAME_FETCH_SUCCESS':
      return singleEntity(state, action, 'SUCCESS', ['href', 'website_name'])
    case 'FIRST_SUBSCRIPTION_IFRAME_FETCH_FAILURE':
      return singleEntity(state, action, 'FAILURE', ['href', 'website_name'])
    default:
      return state
  }
}

function synchronization(state = initialState.iframe, action = {type: null}) {
  switch (action.type) {
    case 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_START':
      return singleEntity(state, action, 'START', [])
    case 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_SUCCESS':
      return singleEntity(state, action, 'SUCCESS', [])
    case 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_FAILURE':
      return singleEntity(state, action, 'FAILURE', [])
    default:
      return state
  }
}

export default combineReducers({
  flowStage,
  iframe,
  synchronization
})
