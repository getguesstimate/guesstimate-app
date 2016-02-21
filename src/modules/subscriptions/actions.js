import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

function actionType(action, event) {
  return `${action}_${event}`
}

function errorAction(action, error) {
  return {
      type: actionType(action, 'FAILURE'),
      error
  }
}

function successAction(action, value) {
  console.log('type...', actionType(action, 'SUCCESS'))
  return {
      type: actionType(action, 'SUCCESS'),
      value
  }
}

function simpleCallback({dispatch, action}) {
  return (err, value) => {
    if (err) { dispatch(errorAction(action, err)) }
    else if (value) { dispatch(successAction(action, value)) }
  }
}

export function fetch_iframe() {
  return (dispatch, getState) => {
    const action = 'SUBSCRIPTION_IFRAME_FETCH'
    dispatch({type: actionType(action, 'START')})
    api(getState()).subscriptions.get_new_iframe(
      simpleCallback({dispatch, action})
    )
  }
}

export function fetch_portal() {
  return (dispatch, getState) => {
    const action = 'SUBSCRIPTION_PORTAL_FETCH'
    dispatch({type: actionType(action, 'START')})
    api(getState()).subscriptions.get_portal(
      simpleCallback({dispatch, action})
    )
  }
}
